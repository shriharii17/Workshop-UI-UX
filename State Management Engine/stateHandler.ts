import {
  StateMachineConfig,
  Context,
  Event,
  TransitionConfig,
  StateDefinition      
} from './types';

export class StateHandler {
  private _currentState: string;
  private _context: Context;
  private config: StateMachineConfig;
  private lastExecutedEvent: Event | null = null;

  constructor(
    config: StateMachineConfig,
    initialCurrentState?: string,
    initialContext?: Context
  ) {
    this.config = config;
    this._currentState = initialCurrentState ?? config.initialState;
    this._context = initialContext ?? { ...config.context };
  }

  // Execute a transition. Supports both sync and async
  public async execute(
    eventType: string,
    eventPayload?: any            
  ): Promise<boolean> {                    
    const event: Event = { type: eventType, payload: eventPayload };
    this.lastExecutedEvent = event;

    const currentStateDefinition = this.config.states[this._currentState];
    if (!currentStateDefinition) {
      console.warn(`[StateHandler] Unknown current state '${this._currentState}'.`);
      return false;
    }

    /* ---------- find the transition ---------- */
    const fromOn = currentStateDefinition.on?.[eventType];
    const direct = (currentStateDefinition as any)[eventType];
    const transition: TransitionConfig | string | undefined = fromOn ?? direct;

    if (!transition) {
      console.log(
        `[StateHandler] No transition for '${eventType}' from '${this._currentState}'.`
      );
      return false;
    }

    
    const targetState = typeof transition === 'string' ? transition : transition.target;
    const validateFn  = typeof transition === 'string' ? undefined : transition.validate;
    const actions     = typeof transition === 'string' ? undefined : transition.actions;

    /* ---------- run validation ---------- */
    if (validateFn) {
      const ok = await validateFn(event, this._context); 
      if (!ok) {
        console.log(`[StateHandler] Validation failed for '${eventType}'.`);
        return false;
      }
    }

    /* ---------- run actions ---------- */
    if (actions) {
      for (const action of actions) {
        try {
          await action(event, this._context);   
        } catch (err) {
          console.error(`[StateHandler] Action error:`, err);
        }
      }
    }

    /* ---------- state change ---------- */
    if (!this.config.states[targetState]) {
      console.warn(`[StateHandler] Target state '${targetState}' missing in config.`);
      return false;
    }

    this._currentState = targetState;
    console.log(`[StateHandler] State changed to: ${this._currentState}`);
    return true;
  }
    
     // Returns an array of possible next states from the current state
    public targetStates(): string[] {
        const currentStateDefinition = this.config.states[this._currentState];
        if (!currentStateDefinition) {
            return [];
        }

        const possibleTargets: Set<string> = new Set();

        // Check 'on' property for targets
        if (currentStateDefinition.on) {
            for (const eventType in currentStateDefinition.on) {
                const transition = currentStateDefinition.on[eventType];
                if (typeof transition === 'string') {
                    possibleTargets.add(transition);
                } else {
                    possibleTargets.add(transition.target);
                }
            }
        }

        // Check direct transitions at the state level 
        for (const key in currentStateDefinition) {
            if (key !== 'on') { 
                const directTransition = currentStateDefinition[key];
                 if (typeof directTransition === 'string') {
                    possibleTargets.add(directTransition);
                } else if (typeof directTransition === 'object' && directTransition !== null && 'target' in directTransition) {
                    possibleTargets.add((directTransition as TransitionConfig).target);
                }
            }
        }

        return Array.from(possibleTargets);
    }

    // check if a transition is possible
    public can(eventType: string): boolean {
        const currentStateDefinition: StateDefinition | undefined = this.config.states[this._currentState];
        if (!currentStateDefinition) {
            return false;
        }

        if (currentStateDefinition.on && currentStateDefinition.on[eventType]) {
            return true;
        }

        // Check direct transitions at the state level
        const directTransition = currentStateDefinition[eventType];
        if (directTransition !== undefined && directTransition !== null) {
            return true;
        }

        return false;
    }

    
    // gets the current state of the state machine
    public get currentState(): string {
        return this._currentState;
    }

    
    // Gets the current context of the state machine
    public get context(): Context {
        return this._context;
    }


    // Gets the last event that was attempted to be executed
    public get lastEvent(): Event | null {
        return this.lastExecutedEvent;
    }
}