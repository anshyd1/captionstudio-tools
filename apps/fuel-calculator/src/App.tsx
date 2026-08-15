import { useEffect, useMemo, useState } from 'react'

type Fuel = 'HSD' | 'MS'
type Mode = 'allHsd' | 'mixed'
type Reading = { evening: string; morning: string }
type Payments = { udhari:string; paytm:string; fcard:string; phonepe:string; bank:string; kharche:string; cash:string; other:string }
type Draft = {
  mode: Mode; date: string; note: string; readings: Record<Mode, Reading[]>;
  hsdTesting:string; hsdRate:string; msTesting:string; msRate:string; extra:string; payments:Payments
}

const productMap: Record<Mode, Fuel[]> = {
  allHsd: ['HSD','HSD','HSD','HSD'],
  mixed: ['MS','HSD','MS','HSD']
}
const sampleReadings: Record<Mode, Reading[]> = {
  allHsd: [
    {evening:'1100',morning:'1000'}, {evening:'2120',morning:'2000'},
    {evening:'3080',morning:'3000'}, {evening:'4110',morning:'4000'}
  ],
  mixed: [
    {evening:'5060',morning:'5000'}, {evening:'6090',morning:'6000'},
    {evening:'7070',morning:'7000'}, {evening:'8100',morning:'8000'}
  ]
}
const emptyPayments: Payments = {udhari:'0',paytm:'0',fcard:'0',phonepe:'0',bank:'0',kharche:'0',cash:'0',other:'0'}
const initialDraft = (): Draft => ({
  mode:'allHsd', date:new Date().toISOString().slice(0,10), note:'',
  readings: structuredClone(sampleReadings), hsdTesting:'0', hsdRate:'95.50', msTesting:'0', msRate:'102.01', extra:'0', payments:{...emptyPayments}
})
const num = (v:string) => Number.isFinite(Number.parseFloat(v)) ? Number.parseFloat(v) : 0
const inr = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:2,maximumFractionDigits:2})
const qty = (v:number) => new Intl.NumberFormat('en-IN',{minimumFractionDigits:3,maximumFractionDigits:3}).format(v)

function Field({label,value,onChange,step='0.01',placeholder,type='number'}:{label:string,value:string,onChange:(v:string)=>void,step?:string,placeholder?:string,type?:'number'|'date'|'text'}){
  return <label className="field-label"><span>{label}</span><input inputMode={type==='number'?'decimal':undefined} type={type} step={type==='number'?step:undefined} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/></label>
}

export default function App(){
  const [draft,setDraft] = useState<Draft>(()=>{
    try { const saved=localStorage.getItem('fuel-hisab-pro-draft'); return saved ? {...initialDraft(),...JSON.parse(saved)} : initialDraft() } catch { return initialDraft() }
  })
  const [saved,setSaved] = useState(false)
  const [showInstall,setShowInstall] = useState(false)
  const map=productMap[draft.mode]
  const diffs=useMemo(()=>draft.readings[draft.mode].map(r=>num(r.evening)-num(r.morning)),[draft.readings,draft.mode])
  const gross=useMemo(()=>map.reduce((a,f,i)=>{a[f]+=diffs[i];return a},{HSD:0,MS:0} as Record<Fuel,number>),[map,diffs])
  const hsdNet=gross.HSD-num(draft.hsdTesting), msNet=gross.MS-num(draft.msTesting)
  const hsdAmount=hsdNet*num(draft.hsdRate), msAmount=msNet*num(draft.msRate)
  const finalSale=hsdAmount+msAmount+num(draft.extra)
  const accounted=Object.values(draft.payments).reduce((sum,v)=>sum+num(v),0)
  const balance=finalSale-accounted
  const hasNegative=diffs.some(d=>d<0)
  const matched=Math.abs(balance)<=0.05

  useEffect(()=>{ setShowInstall(window.matchMedia('(display-mode: browser)').matches) },[])
  const updateReading=(index:number,key:keyof Reading,value:string)=>setDraft(d=>{
    const readings={...d.readings,[d.mode]:d.readings[d.mode].map((r,i)=>i===index?{...r,[key]:value}:r)}
    return {...d,readings}
  })
  const updatePayment=(key:keyof Payments,value:string)=>setDraft(d=>({...d,payments:{...d.payments,[key]:value}}))
  const save=()=>{localStorage.setItem('fuel-hisab-pro-draft',JSON.stringify(draft));setSaved(true);setTimeout(()=>setSaved(false),1400)}
  const reset=()=>setDraft(d=>({...initialDraft(),mode:d.mode,date:d.date,note:d.note,readings:{...initialDraft().readings,[d.mode]:structuredClone(sampleReadings[d.mode])}}))

  return <div className="shell">
    <header className="hero">
      <div className="brand"><div className="brand-mark">FH</div><div><strong>Fuel Hisab Pro</strong><span>One-day totalizer & payment reconciliation</span></div></div>
      <div className="hero-row">
        <Field label="Date" value={draft.date} type="date" onChange={date=>setDraft(d=>({...d,date}))}/>
        <label className="field-label"><span>Machine / Staff note</span><input value={draft.note} placeholder="e.g. M1 / Ramesh" onChange={e=>setDraft(d=>({...d,note:e.target.value}))}/></label>
      </div>
    </header>

    <nav className="mode-tabs" aria-label="Calculation mode">
      <button className={draft.mode==='allHsd'?'active':''} onClick={()=>setDraft(d=>({...d,mode:'allHsd'}))}><b>Mode 1</b><span>HSD · HSD · HSD · HSD</span></button>
      <button className={draft.mode==='mixed'?'active':''} onClick={()=>setDraft(d=>({...d,mode:'mixed'}))}><b>Mode 2</b><span>MS · HSD · MS · HSD</span></button>
    </nav>

    <main>
      <section className="card">
        <div className="section-head"><div><p className="eyebrow">Step 1</p><h2>Totalizer readings</h2></div><span className="help">Evening − Morning</span></div>
        <div className="totalizer-grid">{map.map((fuel,i)=><article className="totalizer" key={`${draft.mode}-${i}`}>
          <div className="totalizer-head"><b>T{i+1}</b><span className={`fuel ${fuel.toLowerCase()}`}>{fuel}</span></div>
          <Field label="Evening / Closing" value={draft.readings[draft.mode][i].evening} step="0.001" onChange={v=>updateReading(i,'evening',v)}/>
          <Field label="Morning / Opening" value={draft.readings[draft.mode][i].morning} step="0.001" onChange={v=>updateReading(i,'morning',v)}/>
          <div className={`difference ${diffs[i]<0?'bad':''}`}><span>Difference</span><strong>{qty(diffs[i])}</strong></div>
        </article>)}</div>
        {hasNegative && <div className="alert">Negative difference मिला है—Evening और Morning reading check करें।</div>}
      </section>

      <section className="card">
        <div className="section-head"><div><p className="eyebrow">Step 2</p><h2>Testing & editable rates</h2></div><span className="help">Yellow fields editable</span></div>
        <div className="settings-grid">
          <div className="setting hsd"><h3>HSD settings</h3><div className="two"><Field label="Testing qty" value={draft.hsdTesting} step="0.001" onChange={hsdTesting=>setDraft(d=>({...d,hsdTesting}))}/><Field label="Rate" value={draft.hsdRate} onChange={hsdRate=>setDraft(d=>({...d,hsdRate}))}/></div></div>
          {draft.mode==='mixed' && <div className="setting ms"><h3>MS settings</h3><div className="two"><Field label="Testing qty" value={draft.msTesting} step="0.001" onChange={msTesting=>setDraft(d=>({...d,msTesting}))}/><Field label="Rate" value={draft.msRate} onChange={msRate=>setDraft(d=>({...d,msRate}))}/></div></div>}
          <div className="setting extra"><h3>Extra adjustment</h3><Field label="Plus (+) / Minus (−)" value={draft.extra} onChange={extra=>setDraft(d=>({...d,extra}))}/></div>
        </div>
      </section>

      <section className="card">
        <div className="section-head"><div><p className="eyebrow">Step 3</p><h2>Fuel sale summary</h2></div><span className="help">Live calculation</span></div>
        <div className="summary-grid">
          <ProductSummary fuel="HSD" gross={gross.HSD} testing={num(draft.hsdTesting)} net={hsdNet} rate={num(draft.hsdRate)} amount={hsdAmount}/>
          {draft.mode==='mixed' && <ProductSummary fuel="MS" gross={gross.MS} testing={num(draft.msTesting)} net={msNet} rate={num(draft.msRate)} amount={msAmount}/>} 
        </div>
        <div className="sale-total"><div><span>FINAL FUEL SALE</span><strong>{inr.format(finalSale)}</strong></div><span className="pill">Calculated</span></div>
      </section>

      <section className="card">
        <div className="section-head"><div><p className="eyebrow">Step 4</p><h2>Payment, udhari & cash</h2></div><span className="help">Sale reconciliation</span></div>
        <div className="payment-grid">
          {(Object.entries({udhari:'Total Udhari',paytm:'Total Paytm',fcard:'Total F-Card',phonepe:'Total PhonePe',bank:'Bank / Other',kharche:'Total Kharche',cash:'Total Cash',other:'Other adjustment'}) as [keyof Payments,string][]).map(([key,label])=><Field key={key} label={label} value={draft.payments[key]} onChange={v=>updatePayment(key,v)}/>)}
        </div>
        <div className="recon-grid"><Metric label="Final fuel sale" value={inr.format(finalSale)}/><Metric label="Total accounted" value={inr.format(accounted)}/><Metric label="Balance / fault" value={inr.format(balance)} danger={!matched}/></div>
        <div className={`match ${matched?'':'check'}`}>{matched?'MATCH — हिसाब बराबर है':`CHECK — ${inr.format(balance)} का difference`}</div>
      </section>

      <div className="actions"><button className="secondary" onClick={reset}>Reset mode</button><button className="primary" onClick={save}>{saved?'Saved ✓':'Save draft'}</button></div>
      {showInstall && <p className="install-note">PWA ready: browser menu से “Add to Home Screen” चुनकर app install करें।</p>}
    </main>
    <footer>Fuel Hisab Pro · Data आपके device पर local रहता है</footer>
  </div>
}

function ProductSummary({fuel,gross,testing,net,rate,amount}:{fuel:Fuel,gross:number,testing:number,net:number,rate:number,amount:number}){
 return <article className={`product-summary ${fuel.toLowerCase()}`}><h3>{fuel}</h3><dl><div><dt>Total qty</dt><dd>{qty(gross)}</dd></div><div><dt>Testing</dt><dd>{qty(testing)}</dd></div><div><dt>Net qty</dt><dd>{qty(net)}</dd></div><div><dt>Rate</dt><dd>{inr.format(rate)}</dd></div><div className="amount"><dt>{fuel} amount</dt><dd>{inr.format(amount)}</dd></div></dl></article>
}
function Metric({label,value,danger=false}:{label:string,value:string,danger?:boolean}){return <div className={`metric ${danger?'danger':''}`}><span>{label}</span><strong>{value}</strong></div>}
