import { Link } from 'react-router-dom'
import { Page } from '../components/ui'

const links = [
  ['/donts', "Don'ts: what makes it worse"],
  ['/bend', 'Getting the bend back (knee flexion guide)'],
  ['/shopping', 'Weekly shopping list (share)'],
  ['/supplements', 'Supplements (vegetarian options)'],
  ['/safety', 'Safety and when to call your doctor'],
  ['/mri', 'MRI guide: what the findings mean'],
  ['/checkpoints', 'Checkpoints and 6-month progression'],
  ['/living', 'Living with your knee'],
  ['/settings', 'Settings, backup and move to another device'],
]

export default function More() {
  return (
    <Page title="More">
      <ul className="flex flex-col gap-2">
        {links.map(([to, label]) => <li key={to}><Link to={to} className="panel flex items-center">{label}</Link></li>)}
      </ul>
    </Page>
  )
}
