import { useEffect } from "react";
import { fromEvent, timer } from "rxjs";
import {
  debounceTime,
  scan,
  switchMap,
  takeUntil,
  takeLast,
} from "rxjs/operators";
import { useFirebase } from "~/hooks";

const canvas = document.getElementsByTagName("canvas");
const pointerDown$ = fromEvent<PointerEvent>(canvas, "pointerdown");
const pointerUp$ = fromEvent<PointerEvent>(canvas, "pointerup");

const ms = 50;
const timerStream$ = pointerDown$.pipe(
  // start counting at time 'ms', and keep counting
  // every interval of 'ms', until the pointer comes up,
  // at which point we're only interested in the final value
  switchMap(() => timer(ms, ms).pipe(takeUntil(pointerUp$), takeLast(1)))
);

export function useClickstream({ user, setClickCount, setClickDuration }) {
  const { db } = useFirebase();

  useEffect(() => {
    pointerUp$
      .pipe(
        // debounce inputs
        debounceTime(ms),

        // count the total number of clicks
        scan((count) => count + 1, 0)
      )
      .subscribe((count) => {
        console.log(`Clicked ${count} times`);
        setClickCount(count);

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

    timerStream$.subscribe((val) => {
      const durationSeconds = val / (1000 / ms);
      console.log(`${durationSeconds} seconds`);
      setClickDuration(durationSeconds);

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
  }, [db, user]);
}
