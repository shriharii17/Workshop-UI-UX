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


### Components:
1. **State Configuration (`config.ts`)** - contains the State Machine's configuration:
  > - Initial state
  > - Context (mutable)
  > - Definition of each state
  > - Events and transition rules per state


2. **StateHandler Class (`stateHandler.ts`)** -  Handles:
  > - Validating and executing events
  > - Determining if a transition is possible
  > - Running actions
  > - Updating internal context and state


3. **Main Program (`main.ts`)** -

> Instantiates a StateHandler with current state and context, executes sample transitions and logs results


### Workflow Example:
```
Start in: open
event: ASSIGN
-> validate(): passes
-> action(): "Assigned from open"
New state: assigned
event: START
-> validate(): passes
-> action(): "Started working"
New state: wip
event: COMPLETE
-> validate(): passes
-> action(): "Completed task"
Final state: completed
```


### Output:
![Screenshot 2025-05-27 075253](https://github.com/user-attachments/assets/d7ae5197-debf-4525-b4b0-a0721f504afd)





