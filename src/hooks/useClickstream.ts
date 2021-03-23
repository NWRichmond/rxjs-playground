import { useEffect, useRef } from "react";
import { fromEvent, timer } from "rxjs";
import {
  debounceTime,
  scan,
  switchMap,
  takeUntil,
  takeLast,
} from "rxjs/operators";

import { useFirebase } from "~/hooks";

export function useClickstream({
  user,
  setClickCount,
  setClickDuration,
  timerInterval = 50,
}) {
  const { db } = useFirebase();
  const canvas = useRef(null);

  useEffect(() => {
    canvas.current = document.getElementsByTagName("canvas");
    const pointerDown$ = fromEvent<PointerEvent>(canvas.current, "pointerdown");
    const pointerUp$ = fromEvent<PointerEvent>(canvas.current, "pointerup");

    pointerUp$
      .pipe(
        // debounce inputs
        debounceTime(timerInterval),

        // count the total number of clicks
        scan((count) => count + 1, 0)
      )
      .subscribe((count) => {
        setClickCount(count);
        console.log(`Clicked ${count} times`);

        if (user?.uid) {
          const { displayName, uid } = user;
          const userRef = db.collection("clickstream").doc(uid);

          userRef.set(
            {
              clickCount: count,
              displayName,
            },
            { merge: true }
          );
        }
      });

    const timerStream$ = pointerDown$.pipe(
      // start counting at time 'timerInterval', and keep counting
      // every interval of 'timerInterval', until the pointer comes up,
      // at which point we're only interested in the final value
      switchMap(() =>
        timer(timerInterval, timerInterval).pipe(
          takeUntil(pointerUp$),
          takeLast(1)
        )
      )
    );

    timerStream$.subscribe((val) => {
      const durationSeconds = val / (1000 / timerInterval);
      setClickDuration(durationSeconds);
      console.log(`Drew for: ${durationSeconds} seconds`);

      if (user?.uid) {
        const { displayName, uid } = user;
        const userRef = db.collection("clickstream").doc(uid);

        userRef.set(
          {
            clickDuration: durationSeconds,
            displayName,
          },
          { merge: true }
        );
      }
    });
  }, [db, user, canvas.current]);
}
