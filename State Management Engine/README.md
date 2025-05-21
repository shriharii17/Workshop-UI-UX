# STATE MANAGER

## Overview of the State Management Model:

### States:
1. `open`
2. `assigned`
3. `wip`
4. `rejected`
5. `canceled`
6. `completed`

### Events:
1. ASSIGN
2. CANCEL
3. START
4. REJECT
5. COMPLETE

### Possible Transitions:
#### (curreent_state -- event --> target_state)
1. `open` -- ASSIGN --> `assigned`
2. `open` -- CANCEL --> `canceled`
3. `assigned` -- START --> `wip`
4. `assigned` -- REJECT --> `rejected`
5. `wip` -- COMPLETE --> `completed`
6. `rejected `-- ASSIGN --> `assigned`
7. `rejected` -- CANCEL --> `canceled`

#### ------------------------------------
- Initial state is `open`.
- Transition between states is caused by the events as a trigger.
- Each event has a type string and a payload (optional)
- 




