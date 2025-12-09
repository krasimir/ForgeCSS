import React from 'react';
import { fx } from 'forgecss/fx';

export default function App({ className }: { className?: string }) {
  const foo = 'bar';
  return (
    <main>
      <h1 className={fx("text-3xl desktop:mt1")}>Hello world!</h1>
      <p className={fx(`my2 mobile:my1 ${className} text-small`)}>Something else</p>
      <p className="fz1 desktop:red">No usage of fx so no pick up</p>
    </main>
  );
}