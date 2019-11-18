import Util from '../util';


const EventPipe = (function() {

    /**
     * EventPipe class can be used to multicast and send custom events to registered listeners.
     * Each event in an event queue will be sent to each registerd listener.
     */
    class EventPipe {
        constructor() {
            this.eventsQueue = [];
            this.callQueue = [];
            this.loopTimeout;
        }

        containsEvent() {
            return this.eventsQueue.find(ev => ev.type === event.type);
        }

        /**
         * Function sends an event object though the EventPipe. The event must have a type attribute
         * defined otherwise an error is thrown. 
         * Example defintion of the event object. 
         * { 
         *   type: 'some event',
         *   ...payload
         * }
         * If an event listener is defined the sent event will be received on the event listener.
         * @param {object} event 
         */
        send(event) {
            if (Util.isEmpty(event.type))
                throw new Error('Event must have type attribute.');
            
            if (!this.containsEvent())
                this.eventsQueue.push(event);

            this.loopEvents();
        }

        loopEvents() {
            if (this.loopTimeout)
                Util.clearTimeout(this.loopTimeout);

            this.loopTimeout = Util.setTimeout(() => {
                this.callQueue.forEach(eventCallback => 
                    this.eventsQueue.forEach(ev => eventCallback(ev)));

                this.eventsQueue = [];
                this.callQueue = [];
            });
        }

        /**
         * Function registers an event listener function that receives an event sent through the
         * EventPipe. Each listener will receive each event that are in an event queue. The listener
         * function receives the event as a parameter.
         * @param {function} eventCallback 
         */
        receive(eventCallback) {
            this.callQueue.push(eventCallback);
        }

    }

    const eventPipe = new EventPipe();

    return {
        send: eventPipe.send.bind(eventPipe),
        receive: eventPipe.receive.bind(eventPipe)
    }

})();

export default EventPipe;