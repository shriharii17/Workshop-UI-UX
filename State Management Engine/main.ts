import { StateHandler } from './stateHandler';
import { configuration } from './config';

(async () => {
  const sm = new StateHandler(configuration);

  await sm.execute('ASSIGN');           // open -> assigned
  await sm.execute('START');            // assigned -> wip
  console.log('next states:', sm.targetStates()); // ["completed"]
  console.log('can COMPLETE?', sm.can('COMPLETE')); // true

  await sm.execute('COMPLETE');         // wip -> completed
  console.log('final state:', sm.currentState);    // "completed"
  console.log('context:', sm.context);             // context
})();
