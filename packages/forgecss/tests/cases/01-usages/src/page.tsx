import React from 'react';
import { fx } from 'forgecss/fx';

export default function App({ className }: { className?: string }) {
  const foo = 'bar';
  const flagA = true;
  const flagB = false;

  return (
    <main>
      <h1 className={fx("a desktop:b")}>Hello world!</h1>
      <p className={fx(`c mobile:d desktop:b2 ${className} e`)}>Something else</p>
      <p className="f desktop:g">No usage of fx so no pick up</p>
      <p className={fx(`a [${flagA}]:b [${flagB}]:c`)}></p>
      <button className={fx("[&:hover]:a")}></button>
      <p className={fx("a [.dark &]:b c")}></p>
      <p className={fx("a [.dark desktop:b]:c d")}></p>
      <p className={fx("a [.dark &:has(.desc)]:c d")}></p>
      <p className={fx("a [.dark &[type='password']]:c d")}></p>
    </main>
  );
}