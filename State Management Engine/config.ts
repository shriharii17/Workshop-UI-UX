import { StateMachineConfig } from './types';

export const configuration: StateMachineConfig = {
  initialState: 'open',
  context: { data: {} },

  states: {
    open: {
      on: {
        ASSIGN: {
          target: 'assigned',
          validate: (_e, _ctx) => true,
          actions: [
            async (_e, ctx) => { ctx.data.note = 'Assigned from open'; }
          ]
        },
        CANCEL: 'canceled'
      }
    },

    assigned: {
      on: {
        START: {
          target: 'wip',
          validate: () => true,
          actions: [(_e, ctx) => { ctx.data.started = true; }]
        },
        REJECT: 'rejected'
      }
    },

    wip: {
      on: {
        COMPLETE: {
          target: 'completed',
          actions: [(_e, ctx) => { ctx.data.done = true; }]
        }
      }
    },

    rejected: {
      ASSIGN: {
        target: 'assigned',
        actions: [(_e, ctx) => { ctx.data.reassigned = true; }]
      },
      CANCEL: 'canceled'
    },

    canceled : {},
    completed: {}
  }
};
