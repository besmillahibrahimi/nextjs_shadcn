import { ThemeToggle } from "@/components/them-toggler";

const colors = ["primary", "neutral", "accent", "error", "success", "warning"];

export default function ColorsPage() {
  return (
    <main className="container mx-auto py-12">
      <div className="prose !max-w-full">
        <h1>Colors</h1>
        <ThemeToggle useSwitch />
        {colors.map((color) => (
          <section key={color} id={color}>
            <h2>{color}</h2>
            <div className="grid grid-cols-5 gap-4">
              <div style={{ backgroundColor: `var(--${color}-100)` }} className={"p-3 rounded"}>
                <p>{`${color}-100`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-200)` }} className={"p-3 rounded"}>
                <p>{`${color}-200`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-300)` }} className={"p-3 rounded"}>
                <p>{`${color}-300`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-400)` }} className={"p-3 rounded"}>
                <p>{`${color}-400`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-500)` }} className={"p-3 rounded"}>
                <p>{`${color}-500`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-600)` }} className={"p-3 rounded"}>
                <p>{`${color}-600`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-700)` }} className={"p-3 rounded"}>
                <p>{`${color}-700`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-800)` }} className={"p-3 rounded"}>
                <p>{`${color}-800`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-900)` }} className={"p-3 rounded"}>
                <p>{`${color}-900`}</p>
              </div>
              <div style={{ backgroundColor: `var(--${color}-950)` }} className={"p-3 rounded"}>
                <p>{`${color}-950`}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
