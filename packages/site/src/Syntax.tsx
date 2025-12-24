import fx from "forgecss/fx";

const EXAMPLES = [
  {
    input: (
      <span>
        <span className="bit1">foo</span> <span className="bit2">bar</span>
      </span>
    ),
    output: <span>-</span>,
    text: (
      <span>
        <code>foo</code> and <code>bar</code> are just tokens here. No CSS is generated.
      </span>
    )
  }
];

export default function Syntax() {
  return (
    <div id="syntax" className="black-bg">
      <h2 className={fx("pt2 tac fz2 desktop:fz3")}>syntax</h2>
      {EXAMPLES.map((example, i) => {
        return (
          <div className="maxw800 mxauto mt1 syntax-example" key={i}>
            <div className={fx("grid2")}>
              <div className="tac p1 input">{example.input}</div>
              <div className="tac p1 output">{example.output}</div>
            </div>
            <div className="tac p1">
              <small>{example.text}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}
