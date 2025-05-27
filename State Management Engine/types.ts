export interface Event {
  type: string;
  payload?: Record<string, any>;
}

export interface Context {
  [key: string]: any;
}


//  Describes the structure of a transition configuration, which can include async validation and actions.

export interface TransitionConfig {
  target: string;
  validate?: (event: Event, context: Context) => boolean | Promise<boolean>;
  actions?: ((event: Event, context: Context) => void | Promise<void>)[];
}


// A map of event types to either a direct target string or a detailed TransitionConfig.

export type StateTransitions = {
  [eventType: string]: string | TransitionConfig;
};


// Describes a state and how it can transition. Allows both 'on' transitions and direct event-based transitions.
 
export interface StateDefinition {
  on?: StateTransitions;
// Direct transitions like: "APPROVE": "approved" or { target: "approved", ... }
  [eventName: string]: string | TransitionConfig | StateTransitions | undefined;
}

// Top-level config for the entire state machine.

export interface StateMachineConfig {
  initialState: string;
  context: Context;
  states: {
    [stateName: string]: StateDefinition;
  };
}
