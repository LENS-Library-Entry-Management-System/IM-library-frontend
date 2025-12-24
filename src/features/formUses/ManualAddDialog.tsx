import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import client from "@/api/client"
import { toast } from "sonner"
import { colleges, departmentsByCollege, yearLevels } from "@/lib/colleges"
import { useQueryClient } from "@tanstack/react-query"
// removed unused: useLayout, useSearch

function randomManualRfid(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890'
  let tail = ''
  for (let i = 0; i < 8; i++) tail += chars[Math.floor(Math.random() * chars.length)]
  return `MANUAL-${tail}`
}

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export default function ManualAddDialog({ open, onOpenChange }: Props) {
  const [userType, setUserType] = React.useState<'student' | 'faculty'>('student')
  const [idNumber, setIdNumber] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [college, setCollege] = React.useState('')
  const [department, setDepartment] = React.useState('')
  const [yearLevel, setYearLevel] = React.useState('')
  const [date, setDate] = React.useState<string>(new Date().toISOString().slice(0, 10))
  const [time, setTime] = React.useState<string>(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const [submitting, setSubmitting] = React.useState(false)

  const deptOptions = React.useMemo(() => departmentsByCollege[college] ?? [], [college])
  React.useEffect(() => {
    if (department && !deptOptions.includes(department)) setDepartment('')
  }, [deptOptions, department])

  const qc = useQueryClient()

  function assembleTimestamp() {
    try {
      const [h, m] = time.split(':').map((v) => Number(v))
      const [y, mo, d] = date.split('-').map((v) => Number(v))
      const dt = new Date(y, (mo || 1) - 1, d || 1, h || 0, m || 0)
      return dt.toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  async function createUserIfMissing(): Promise<void> {
    // Try to create user; if conflicts on idNumber, assume exists and continue
    const payload: Record<string, unknown> = {
      idNumber: idNumber.trim(),
      rfidTag: randomManualRfid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userType,
      college,
      department,
      status: 'active',
    }
    if (userType === 'student') payload.yearLevel = yearLevel
    try {
      await client.post('/users', payload)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: unknown } }; message?: unknown }
      const msg = String(e?.response?.data?.message ?? e?.message ?? '')
      if (msg.toLowerCase().includes('id number already exists')) {
        return
      }
      if (msg.toLowerCase().includes('rfid tag already exists')) {
        // Retry once with a new random RFID
        await client.post('/users', { ...payload, rfidTag: randomManualRfid() })
        return
      }
      throw err
    }
  }

  async function handleSubmit() {
    if (!idNumber.trim() || !firstName.trim() || !lastName.trim() || !userType || !college || (deptOptions.length ? !department : false) || (userType === 'student' && !yearLevel)) {
      toast.warning('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      await createUserIfMissing()
      const entryTimestamp = assembleTimestamp()
      try {
        await client.post('/entries', { idNumber: idNumber.trim(), entryMethod: 'manual', status: 'success', entryTimestamp })
      } catch (postErr: unknown) {
        const pe = postErr as { response?: { status?: number } }
        const status = pe?.response?.status
        if (status === 401 || status === 403 || status === 404) {
          // Fallback to public manual endpoint (uses current timestamp)
          await client.post('/entries/manual', { idNumber: idNumber.trim() })
        } else {
          throw postErr
        }
      }
      toast.success('Manual user/log created')
      // Invalidate all entries queries to ensure refresh regardless of page/filters
      qc.invalidateQueries({ queryKey: ['entries'] })
      onOpenChange(false)
      // reset
      setIdNumber(''); setFirstName(''); setLastName(''); setCollege(''); setDepartment(''); setYearLevel('')
    } catch (err) {
      console.error('Manual add failed', err)
      toast.error('Failed to add manual log')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Manual Add Student/Faculty</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">User Type</label>
              <Select value={userType} onChange={(e) => setUserType(e.target.value as 'student' | 'faculty')} className="mt-1">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </Select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">ID Number</label>
              <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="e.g. 2021-0001" className="mt-1" />
            </div>
            <div className="sm:col-span-1">
              <label className="text-sm font-medium">Year Level</label>
              <Select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="mt-1" disabled={userType !== 'student'}>
                <option value="">{userType === 'student' ? 'Select year level' : 'N/A'}</option>
                {yearLevels.map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">College</label>
              <Select value={college} onChange={(e) => setCollege(e.target.value)} className="mt-1">
                <option value="">Select college</option>
                {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1">
                <option value="">{deptOptions.length ? 'Select department' : 'None'}</option>
                {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="ghost" onClick={() => !submitting && onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-primary text-white hover:bg-primary-foreground">Add Manual</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
