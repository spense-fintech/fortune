
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe$1(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe$1(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    function construct_svelte_component(component, props) {
        return new component(props);
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable$1(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const { set, subscribe } = writable$1({});

    const remove = () => {
      set({});
    };

    const activeRoute = {
      subscribe,
      set,
      remove,
    };

    const UrlParser = (urlString, namedUrl = '') => {
      const urlBase = new URL(urlString);

      /**
       * Wrapper for URL.hash
       *
       **/
      function hash() {
        return urlBase.hash;
      }

      /**
       * Wrapper for URL.host
       *
       **/
      function host() {
        return urlBase.host;
      }

      /**
       * Wrapper for URL.hostname
       *
       **/
      function hostname() {
        return urlBase.hostname;
      }

      /**
       * Returns an object with all the named params and their values
       *
       **/
      function namedParams() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values[paramKey.value] = allPathName[paramKey.index];
          return values;
        }, {});
      }

      /**
       * Returns an array with all the named param keys
       *
       **/
      function namedParamsKeys() {
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(paramKey.value);
          return values;
        }, []);
      }

      /**
       * Returns an array with all the named param values
       *
       **/
      function namedParamsValues() {
        const allPathName = pathNames();
        const allNamedParamsKeys = namedParamsWithIndex();

        return allNamedParamsKeys.reduce((values, paramKey) => {
          values.push(allPathName[paramKey.index]);
          return values;
        }, []);
      }

      /**
       * Returns an array with all named param ids and their position in the path
       * Private
       **/
      function namedParamsWithIndex() {
        const namedUrlParams = getPathNames(namedUrl);

        return namedUrlParams.reduce((validParams, param, index) => {
          if (param[0] === ':') {
            validParams.push({ value: param.slice(1), index });
          }
          return validParams;
        }, []);
      }

      /**
       * Wrapper for URL.port
       *
       **/
      function port() {
        return urlBase.port;
      }

      /**
       * Wrapper for URL.pathname
       *
       **/
      function pathname() {
        return urlBase.pathname;
      }

      /**
       * Wrapper for URL.protocol
       *
       **/
      function protocol() {
        return urlBase.protocol;
      }

      /**
       * Wrapper for URL.search
       *
       **/
      function search() {
        return urlBase.search;
      }

      /**
       * Returns an object with all query params and their values
       *
       **/
      function queryParams() {
        const params = {};
        urlBase.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        return params;
      }

      /**
       * Returns an array with all the query param keys
       *
       **/
      function queryParamsKeys() {
        const params = [];
        urlBase.searchParams.forEach((_value, key) => {
          params.push(key);
        });

        return params;
      }

      /**
       * Returns an array with all the query param values
       *
       **/
      function queryParamsValues() {
        const params = [];
        urlBase.searchParams.forEach((value) => {
          params.push(value);
        });

        return params;
      }

      /**
       * Returns an array with all the elements of a pathname
       *
       **/
      function pathNames() {
        return getPathNames(urlBase.pathname);
      }

      /**
       * Returns an array with all the parts of a pathname
       * Private method
       **/
      function getPathNames(pathName) {
        if (pathName === '/' || pathName.trim().length === 0) return [pathName];
        if (pathName.slice(-1) === '/') {
          pathName = pathName.slice(0, -1);
        }
        if (pathName[0] === '/') {
          pathName = pathName.slice(1);
        }

        return pathName.split('/');
      }

      return Object.freeze({
        hash: hash(),
        host: host(),
        hostname: hostname(),
        namedParams: namedParams(),
        namedParamsKeys: namedParamsKeys(),
        namedParamsValues: namedParamsValues(),
        pathNames: pathNames(),
        port: port(),
        pathname: pathname(),
        protocol: protocol(),
        search: search(),
        queryParams: queryParams(),
        queryParamsKeys: queryParamsKeys(),
        queryParamsValues: queryParamsValues(),
      });
    };

    /**
     * Returns true if object has any nested routes empty
     * @param routeObject
     **/
    const anyEmptyNestedRoutes = (routeObject) => {
      let result = false;
      if (Object.keys(routeObject).length === 0) {
        return true;
      }

      if (routeObject.childRoute && Object.keys(routeObject.childRoute).length === 0) {
        result = true;
      } else if (routeObject.childRoute) {
        result = anyEmptyNestedRoutes(routeObject.childRoute);
      }

      return result;
    };

    /**
     * Compare two routes ignoring named params
     * @param pathName string
     * @param routeName string
     **/

    const compareRoutes = (pathName, routeName) => {
      routeName = removeSlash(routeName);

      if (routeName.includes(':')) {
        return routeName.includes(pathName);
      } else {
        return routeName.startsWith(pathName);
      }
    };

    /**
     * Returns a boolean indicating if the name of path exists in the route based on the language parameter
     * @param pathName string
     * @param route object
     * @param language string
     **/

    const findLocalisedRoute = (pathName, route, language) => {
      let exists = false;

      if (language) {
        return { exists: route.lang && route.lang[language] && route.lang[language].includes(pathName), language };
      }

      exists = compareRoutes(pathName, route.name);

      if (!exists && route.lang && typeof route.lang === 'object') {
        for (const [key, value] of Object.entries(route.lang)) {
          if (compareRoutes(pathName, value)) {
            exists = true;
            language = key;
          }
        }
      }

      return { exists, language };
    };

    /**
     * Return all the consecutive named param (placeholders) of a pathname
     * @param pathname
     **/
    const getNamedParams = (pathName = '') => {
      if (pathName.trim().length === 0) return [];
      const namedUrlParams = getPathNames(pathName);
      return namedUrlParams.reduce((validParams, param) => {
        if (param[0] === ':') {
          validParams.push(param.slice(1));
        }

        return validParams;
      }, []);
    };

    /**
     * Split a pathname based on /
     * @param pathName
     * Private method
     **/
    const getPathNames = (pathName) => {
      if (pathName === '/' || pathName.trim().length === 0) return [pathName];

      pathName = removeSlash(pathName, 'both');

      return pathName.split('/');
    };

    /**
     * Return the first part of a pathname until the first named param is found
     * @param name
     **/
    const nameToPath = (name = '') => {
      let routeName;
      if (name === '/' || name.trim().length === 0) return name;
      name = removeSlash(name, 'lead');
      routeName = name.split(':')[0];
      routeName = removeSlash(routeName, 'trail');

      return routeName.toLowerCase();
    };

    /**
     * Return the path name excluding query params
     * @param name
     **/
    const pathWithoutQueryParams = (currentRoute) => {
      const path = currentRoute.path.split('?');
      return path[0];
    };

    /**
     * Return the path name including query params
     * @param name
     **/
    const pathWithQueryParams = (currentRoute) => {
      let queryParams = [];
      if (currentRoute.queryParams) {
        for (let [key, value] of Object.entries(currentRoute.queryParams)) {
          queryParams.push(`${key}=${value}`);
        }
      }

      const hash = currentRoute.hash ? currentRoute.hash : '';

      if (queryParams.length > 0) {
        return `${currentRoute.path}?${queryParams.join('&')}${hash}`;
      } else {
        return currentRoute.path + hash;
      }
    };

    /**
     * Returns a string with trailing or leading slash character removed
     * @param pathName string
     * @param position string - lead, trail, both
     **/
    const removeExtraPaths = (pathNames, basePathNames) => {
      const names = basePathNames.split('/');
      if (names.length > 1) {
        names.forEach(function (name, index) {
          if (name.length > 0 && index > 0) {
            pathNames.shift();
          }
        });
      }

      return pathNames;
    };

    /**
     * Returns a string with trailing or leading slash character removed
     * @param pathName string
     * @param position string - lead, trail, both
     **/

    const removeSlash = (pathName, position = 'lead') => {
      if (position === 'trail' || position === 'both') {
        pathName = pathName.replace(/\/$/, '');
      }

      if (position === 'lead' || position === 'both') {
        pathName = pathName.replace(/^\//, '');
      }

      return pathName;
    };

    /**
     * Returns the name of the route based on the language parameter
     * @param route object
     * @param language string
     **/

    const routeNameLocalised = (route, language = null) => {
      if (!language || !route.lang || !route.lang[language]) {
        return route.name;
      } else {
        return route.lang[language];
      }
    };

    /**
     * Return the path name excluding query params
     * @param name
     **/
    const startsWithNamedParam = (currentRoute) => {
      const routeName = removeSlash(currentRoute);

      return routeName.startsWith(':');
    };

    /**
     * Updates the base route path.
     * Route objects can have nested routes (childRoutes) or just a long name like "admin/employees/show/:id"
     *
     * @param basePath string
     * @param pathNames array
     * @param route object
     * @param language string
     **/

    const updateRoutePath = (basePath, pathNames, route, language, convert = false) => {
      if (basePath === '/' || basePath.trim().length === 0) return { result: basePath, language: null };

      let basePathResult = basePath;
      let routeName = route.name;
      let currentLanguage = language;

      if (convert) {
        currentLanguage = '';
      }

      routeName = removeSlash(routeName);
      basePathResult = removeSlash(basePathResult);

      if (!route.childRoute) {
        let localisedRoute = findLocalisedRoute(basePathResult, route, currentLanguage);

        if (localisedRoute.exists && convert) {
          basePathResult = routeNameLocalised(route, language);
        }

        let routeNames = routeName.split(':')[0];
        routeNames = removeSlash(routeNames, 'trail');
        routeNames = routeNames.split('/');
        routeNames.shift();
        routeNames.forEach(() => {
          const currentPathName = pathNames[0];
          localisedRoute = findLocalisedRoute(`${basePathResult}/${currentPathName}`, route, currentLanguage);

          if (currentPathName && localisedRoute.exists) {
            if (convert) {
              basePathResult = routeNameLocalised(route, language);
            } else {
              basePathResult = `${basePathResult}/${currentPathName}`;
            }
            pathNames.shift();
          } else {
            return { result: basePathResult, language: localisedRoute.language };
          }
        });
        return { result: basePathResult, language: localisedRoute.language };
      } else {
        return { result: basePath, language: currentLanguage };
      }
    };

    const RouterCurrent = (trackPage) => {
      const trackPageview = trackPage || false;
      let activeRoute = '';

      const setActive = (newRoute, updateBrowserHistory) => {
        activeRoute = newRoute.path;
        pushActiveRoute(newRoute, updateBrowserHistory);
      };

      const active = () => {
        return activeRoute;
      };

      /**
       * Returns true if pathName is current active route
       * @param pathName String The path name to check against the current route.
       * @param includePath Boolean if true checks that pathName is included in current route. If false should match it.
       **/
      const isActive = (queryPath, includePath = false) => {
        if (queryPath[0] !== '/') {
          queryPath = '/' + queryPath;
        }

        // remove query params for comparison
        let pathName = UrlParser(`http://fake.com${queryPath}`).pathname;
        let activeRoutePath = UrlParser(`http://fake.com${activeRoute}`).pathname;

        pathName = removeSlash(pathName, 'trail');

        activeRoutePath = removeSlash(activeRoutePath, 'trail');

        if (includePath) {
          return activeRoutePath.includes(pathName);
        } else {
          return activeRoutePath === pathName;
        }
      };

      const pushActiveRoute = (newRoute, updateBrowserHistory) => {
        if (typeof window !== 'undefined') {
          const pathAndSearch = pathWithQueryParams(newRoute);

          if (updateBrowserHistory) {
            window.history.pushState({ page: pathAndSearch }, '', pathAndSearch);
          }
          // Moving back in history does not update browser history but does update tracking.
          if (trackPageview) {
            gaTracking(pathAndSearch);
          }
        }
      };

      const gaTracking = (newPage) => {
        if (typeof ga !== 'undefined') {
          ga('set', 'page', newPage);
          ga('send', 'pageview');
        }
      };

      return Object.freeze({ active, isActive, setActive });
    };

    const RouterGuard = (onlyIf) => {
      const guardInfo = onlyIf;

      const valid = () => {
        return guardInfo && guardInfo.guard && typeof guardInfo.guard === 'function';
      };

      const redirect = () => {
        return !guardInfo.guard();
      };

      const redirectPath = () => {
        let destinationUrl = '/';
        if (guardInfo.redirect && guardInfo.redirect.length > 0) {
          destinationUrl = guardInfo.redirect;
        }

        return destinationUrl;
      };

      return Object.freeze({ valid, redirect, redirectPath });
    };

    const RouterRedirect = (route, currentPath) => {
      const guard = RouterGuard(route.onlyIf);

      const path = () => {
        let redirectTo = currentPath;
        if (route.redirectTo && route.redirectTo.length > 0) {
          redirectTo = route.redirectTo;
        }

        if (guard.valid() && guard.redirect()) {
          redirectTo = guard.redirectPath();
        }

        return redirectTo;
      };

      return Object.freeze({ path });
    };

    function RouterRoute({ routeInfo, path, routeNamedParams, urlParser, namedPath, language }) {
      const namedParams = () => {
        const parsedParams = UrlParser(`https://fake.com${urlParser.pathname}`, namedPath).namedParams;

        return { ...routeNamedParams, ...parsedParams };
      };

      const get = () => {
        return {
          name: path,
          component: routeInfo.component,
          hash: urlParser.hash,
          layout: routeInfo.layout,
          queryParams: urlParser.queryParams,
          namedParams: namedParams(),
          path,
          language,
        };
      };

      return Object.freeze({ get, namedParams });
    }

    function RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage }) {
      let updatedPathRoute;
      let route;
      let routePathLanguage = currentLanguage;

      function updatedPath(currentRoute) {
        route = currentRoute;
        updatedPathRoute = updateRoutePath(basePathName, pathNames, route, routePathLanguage, convert);
        routePathLanguage = convert ? currentLanguage : updatedPathRoute.language;

        return updatedPathRoute;
      }

      function localisedPathName() {
        return routeNameLocalised(route, routePathLanguage);
      }

      function localisedRouteWithoutNamedParams() {
        return nameToPath(localisedPathName());
      }

      function basePathNameWithoutNamedParams() {
        return nameToPath(updatedPathRoute.result);
      }

      function namedPath() {
        let localisedPath = localisedPathName();
        if (localisedPath && !localisedPath.startsWith('/')) {
          localisedPath = '/' + localisedPath;
        }

        return basePath ? `${basePath}${localisedPath}` : localisedPath;
      }

      function routePath() {
        let routePathValue = `${basePath}/${basePathNameWithoutNamedParams()}`;
        if (routePathValue === '//') {
          routePathValue = '/';
        }

        if (routePathLanguage) {
          pathNames = removeExtraPaths(pathNames, localisedRouteWithoutNamedParams());
        }

        const namedParams = getNamedParams(localisedPathName());
        if (namedParams && namedParams.length > 0) {
          namedParams.forEach(function () {
            if (pathNames.length > 0) {
              routePathValue += `/${pathNames.shift()}`;
            }
          });
        }

        return routePathValue;
      }

      function routeLanguage() {
        return routePathLanguage;
      }

      function basePathSameAsLocalised() {
        return basePathNameWithoutNamedParams() === localisedRouteWithoutNamedParams();
      }

      return Object.freeze({
        basePathSameAsLocalised,
        updatedPath,
        basePathNameWithoutNamedParams,
        localisedPathName,
        localisedRouteWithoutNamedParams,
        namedPath,
        pathNames,
        routeLanguage,
        routePath,
      });
    }

    const NotFoundPage$1 = '/404.html';

    function RouterFinder({ routes, currentUrl, routerOptions, convert }) {
      const defaultLanguage = routerOptions.defaultLanguage;
      const sitePrefix = routerOptions.prefix ? routerOptions.prefix.toLowerCase() : '';
      const urlParser = parseCurrentUrl(currentUrl, sitePrefix);
      let redirectTo = '';
      let routeNamedParams = {};
      let staticParamMatch = false;

      function findActiveRoute() {
        let searchActiveRoute = searchActiveRoutes(routes, '', urlParser.pathNames, routerOptions.lang, convert);

        if (!searchActiveRoute || !Object.keys(searchActiveRoute).length || anyEmptyNestedRoutes(searchActiveRoute)) {
          if (typeof window !== 'undefined') {
            searchActiveRoute = routeNotFound(routerOptions.lang);
          }
        } else {
          searchActiveRoute.path = pathWithoutQueryParams(searchActiveRoute);
          if (sitePrefix) {
            searchActiveRoute.path = `/${sitePrefix}${searchActiveRoute.path}`;
          }
        }

        return searchActiveRoute;
      }

      /**
       * Gets an array of routes and the browser pathname and return the active route
       * @param routes
       * @param basePath
       * @param pathNames
       **/
      function searchActiveRoutes(routes, basePath, pathNames, currentLanguage, convert) {
        let currentRoute = {};
        let basePathName = pathNames.shift().toLowerCase();
        const routerPath = RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage });
        staticParamMatch = false;

        routes.forEach(function (route) {
          routerPath.updatedPath(route);

          if (matchRoute(routerPath, route.name)) {
            let routePath = routerPath.routePath();
            redirectTo = RouterRedirect(route, redirectTo).path();

            if (currentRoute.name !== routePath) {
              currentRoute = setCurrentRoute({
                route,
                routePath,
                routeLanguage: routerPath.routeLanguage(),
                urlParser,
                namedPath: routerPath.namedPath(),
              });
            }

            if (route.nestedRoutes && route.nestedRoutes.length > 0 && routerPath.pathNames.length > 0) {
              currentRoute.childRoute = searchActiveRoutes(
                route.nestedRoutes,
                routePath,
                routerPath.pathNames,
                routerPath.routeLanguage(),
                convert
              );
              currentRoute.path = currentRoute.childRoute.path;
              currentRoute.language = currentRoute.childRoute.language;
            } else if (nestedRoutesAndNoPath(route, routerPath.pathNames)) {
              const indexRoute = searchActiveRoutes(
                route.nestedRoutes,
                routePath,
                ['index'],
                routerPath.routeLanguage(),
                convert
              );
              if (indexRoute && Object.keys(indexRoute).length > 0) {
                currentRoute.childRoute = indexRoute;
                currentRoute.language = currentRoute.childRoute.language;
              }
            }
          }
        });

        if (redirectTo) {
          currentRoute.redirectTo = redirectTo;
        }

        return currentRoute;
      }

      function matchRoute(routerPath, routeName) {
        const basePathSameAsLocalised = routerPath.basePathSameAsLocalised();
        if (basePathSameAsLocalised) {
          staticParamMatch = true;
        }

        return basePathSameAsLocalised || (!staticParamMatch && startsWithNamedParam(routeName));
      }

      function nestedRoutesAndNoPath(route, pathNames) {
        return route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length === 0;
      }

      function parseCurrentUrl(currentUrl, sitePrefix) {
        if (sitePrefix && sitePrefix.trim().length > 0) {
          const replacePattern = currentUrl.endsWith(sitePrefix) ? sitePrefix : sitePrefix + "/";
          const noPrefixUrl = currentUrl.replace(replacePattern, '');
          return UrlParser(noPrefixUrl);
        } else {
          return UrlParser(currentUrl);
        }
      }

      function setCurrentRoute({ route, routePath, routeLanguage, urlParser, namedPath }) {
        const routerRoute = RouterRoute({
          routeInfo: route,
          urlParser,
          path: routePath,
          routeNamedParams,
          namedPath,
          language: routeLanguage || defaultLanguage,
        });
        routeNamedParams = routerRoute.namedParams();

        return routerRoute.get();
      }

      const routeNotFound = (customLanguage) => {
        const custom404Page = routes.find((route) => route.name == '404');
        const language = customLanguage || defaultLanguage || '';
        if (custom404Page) {
          return { ...custom404Page, language, path: '404' };
        } else {
          return { name: '404', component: '', path: '404', redirectTo: NotFoundPage$1 };
        }
      };

      return Object.freeze({ findActiveRoute });
    }

    const NotFoundPage = '/404.html';

    let userDefinedRoutes = [];
    let routerOptions = {};
    let routerCurrent;

    /**
     * Object exposes one single property: activeRoute
     * @param routes  Array of routes
     * @param currentUrl current url
     * @param options configuration options
     **/
    const SpaRouter = (routes, currentUrl, options = {}) => {
      routerOptions = { ...options };
      if (typeof currentUrl === 'undefined' || currentUrl === '') {
        currentUrl = document.location.href;
      }

      routerCurrent = RouterCurrent(routerOptions.gaPageviews);

      currentUrl = removeSlash(currentUrl, 'trail');
      userDefinedRoutes = routes;

      const findActiveRoute = () => {
        let convert = false;

        if (routerOptions.langConvertTo) {
          routerOptions.lang = routerOptions.langConvertTo;
          convert = true;
        }

        return RouterFinder({ routes, currentUrl, routerOptions, convert }).findActiveRoute();
      };

      /**
       * Redirect current route to another
       * @param destinationUrl
       **/
      const navigateNow = (destinationUrl, updateBrowserHistory) => {
        if (typeof window !== 'undefined') {
          if (destinationUrl === NotFoundPage) {
            routerCurrent.setActive({ path: NotFoundPage }, updateBrowserHistory);
          } else {
            navigateTo(destinationUrl);
          }
        }

        return destinationUrl;
      };

      const setActiveRoute = (updateBrowserHistory = true) => {
        const currentRoute = findActiveRoute();
        if (currentRoute.redirectTo) {
          return navigateNow(currentRoute.redirectTo, updateBrowserHistory);
        }

        routerCurrent.setActive(currentRoute, updateBrowserHistory);
        activeRoute.set(currentRoute);

        return currentRoute;
      };

      return Object.freeze({
        setActiveRoute,
        findActiveRoute,
      });
    };

    /**
     * Updates the current active route and updates the browser pathname
     * @param pathName String
     * @param language String
     * @param updateBrowserHistory Boolean
     **/
    const navigateTo = (pathName, language = null, updateBrowserHistory = true) => {
      pathName = removeSlash(pathName, 'lead');

      if (language) {
        routerOptions.langConvertTo = language;
      }

      return SpaRouter(userDefinedRoutes, 'http://fake.com/' + pathName, routerOptions).setActiveRoute(
        updateBrowserHistory
      );
    };

    if (typeof window !== 'undefined') {
      // Avoid full page reload on local routes
      window.addEventListener('click', (event) => {
        if (event.target.localName.toLowerCase() !== 'a') return;
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;

        const sitePrefix = routerOptions.prefix ? `/${routerOptions.prefix.toLowerCase()}` : '';
        const targetHostNameInternal = event.target.pathname && event.target.host === window.location.host;
        const prefixMatchPath = sitePrefix.length > 1 ? event.target.pathname.startsWith(sitePrefix) : true;

        if (targetHostNameInternal && prefixMatchPath) {
          event.preventDefault();
          let navigatePathname = event.target.pathname + event.target.search;

          const destinationUrl = navigatePathname + event.target.search + event.target.hash;
          if (event.target.target === '_blank') {
            window.open(destinationUrl, 'newTab');
          } else {
            navigateTo(destinationUrl);
          }
        }
      });

      window.onpopstate = function (_event) {
        let navigatePathname = window.location.pathname + window.location.search + window.location.hash;

        navigateTo(navigatePathname, null, false);
      };
    }

    /* node_modules\svelte-router-spa\src\components\route.svelte generated by Svelte v3.55.1 */

    function create_if_block_2$8(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0].childRoute,
    				params: /*params*/ ctx[1]
    			}
    		});

    	return {
    		c() {
    			create_component(route.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0].childRoute;
    			if (dirty & /*params*/ 2) route_changes.params = /*params*/ ctx[1];
    			route.$set(route_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(route, detaching);
    		}
    	};
    }

    // (8:33) 
    function create_if_block_1$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].component;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: {
    					.../*currentRoute*/ ctx[0],
    					component: ''
    				},
    				params: /*params*/ ctx[1]
    			}
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = {
    				.../*currentRoute*/ ctx[0],
    				component: ''
    			};

    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    // (6:0) {#if currentRoute.layout}
    function create_if_block$e(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*currentRoute*/ ctx[0].layout;

    	function switch_props(ctx) {
    		return {
    			props: {
    				currentRoute: { .../*currentRoute*/ ctx[0], layout: '' },
    				params: /*params*/ ctx[1]
    			}
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*currentRoute*/ 1) switch_instance_changes.currentRoute = { .../*currentRoute*/ ctx[0], layout: '' };
    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*currentRoute*/ ctx[0].layout)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    function create_fragment$y(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$e, create_if_block_1$9, create_if_block_2$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentRoute*/ ctx[0].layout) return 0;
    		if (/*currentRoute*/ ctx[0].component) return 1;
    		if (/*currentRoute*/ ctx[0].childRoute) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { currentRoute = {} } = $$props;
    	let { params = {} } = $$props;

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    	};

    	return [currentRoute, params];
    }

    class Route extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$x, create_fragment$y, safe_not_equal, { currentRoute: 0, params: 1 });
    	}
    }

    /* node_modules\svelte-router-spa\src\components\router.svelte generated by Svelte v3.55.1 */

    function create_fragment$x(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: { currentRoute: /*$activeRoute*/ ctx[0] }
    		});

    	return {
    		c() {
    			create_component(route.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*$activeRoute*/ 1) route_changes.currentRoute = /*$activeRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(route, detaching);
    		}
    	};
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	component_subscribe($$self, activeRoute, $$value => $$invalidate(0, $activeRoute = $$value));
    	let { routes = [] } = $$props;
    	let { options = {} } = $$props;

    	onMount(() => {
    		SpaRouter(routes, document.location.href, options).setActiveRoute();
    	});

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(1, routes = $$props.routes);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	return [$activeRoute, routes, options];
    }

    class Router extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$w, create_fragment$x, safe_not_equal, { routes: 1, options: 2 });
    	}
    }

    async function request$1(
      url,
      method,
      body = null,
      contentType = "application/json",
      headers = {}
    ) {
      headers["Content-Type"] = contentType + ";charset=utf-8";
      return window
        .fetch(url, {
          method,
          body: body != null ? JSON.stringify(body) : null,
          headers,
        })
        .then((res) => res.json())
        .then((data) => {
          try {
            if (data.hasOwnProperty("message")) {
              //alert(data.message);
              window.toast("", data.message, data.type);
            }
          } catch (err) {}
          return data;
        })
        .catch((err) => {
          throw err;
        });
    }
    function handleSubmit(e, callback) {
      const method = e.target.getAttribute("method") || e.target.method;
      const encType = e.target.getAttribute("encType") || e.target.enctype;
      const body = {};
      for (let field of new FormData(e.target)) {
        body[field[0]] = field[1];
      }
      request$1(e.target.action, method, body, encType)
        .then((res) => {
          callback(res, null);
        })
        .catch((err) => {
          callback(null, err);
        });
    }
    //function uploadFile(url, method, body, headers = {}) {}
    var network = {
      request: request$1,
      handleSubmit,
    };
    var network_1 = network.request;

    // index.ts
    var stores = {};
    function getStorage(type) {
      return type === "local" ? localStorage : sessionStorage;
    }
    function writable(key, initialValue, options) {
      console.warn("writable() has been deprecated. Please use persisted() instead.\n\nchange:\n\nimport { writable } from 'svelte-local-storage-store'\n\nto:\n\nimport { persisted } from 'svelte-local-storage-store'");
      return persisted(key, initialValue, options);
    }
    function persisted(key, initialValue, options) {
      const serializer = (options == null ? void 0 : options.serializer) ?? JSON;
      const storageType = (options == null ? void 0 : options.storage) ?? "local";
      const browser = typeof window !== "undefined" && typeof document !== "undefined";
      function updateStorage(key2, value) {
        if (!browser)
          return;
        getStorage(storageType).setItem(key2, serializer.stringify(value));
      }
      if (!stores[key]) {
        const store = writable$1(initialValue, (set2) => {
          const json = browser ? getStorage(storageType).getItem(key) : null;
          if (json) {
            set2(serializer.parse(json));
          }
          if (browser) {
            const handleStorage = (event) => {
              if (event.key === key)
                set2(event.newValue ? serializer.parse(event.newValue) : null);
            };
            window.addEventListener("storage", handleStorage);
            return () => window.removeEventListener("storage", handleStorage);
          }
        });
        const { subscribe, set } = store;
        stores[key] = {
          set(value) {
            updateStorage(key, value);
            set(value);
          },
          update(updater) {
            const value = updater(get_store_value(store));
            updateStorage(key, value);
            set(value);
          },
          subscribe
        };
      }
      return stores[key];
    }

    const session = writable("session", {});
    writable("state", {});
    writable("cache", {});

    /* src\client\pages\Splash.svelte generated by Svelte v3.55.1 */

<<<<<<< HEAD
    function instance$8($$self) {
    	let user = {
    		phone: 999999999,
    		phone_country_code: 99,
    		email: "test@spense.money",
    		name: "Spense",
    		gender: "Male",
    		age: 20,
    		income: 50000
    	};
=======
    function instance$v($$self) {
    	network_1("/api/userauth/session/", "GET").then(data => {
    		session.set(data);
>>>>>>> 6a8b40e8bbf5aa8942c2ae680e59576cfdd03938

    		if (data.hasOwnProperty("user") && data.user.joined) {
    			if (JSON.stringify(data.user.info.address) != "{}" && JSON.stringify(data.user.info.identification) != "{}" && JSON.stringify(data.user.info.bank_account) != "{}" && data.user.info.kyc_status != false) {
    				//navigateTo("/Home");
    				console.log("Welcome you user");
    			} else {
    				//navigateTo("/Onboarding");
    				// KYC?
    				//user.info["kyc_status"] = true;
    				navigateTo("/kyc");
    			}
    		} else {
    			navigateTo("/landing");
    		}
    	});

    	return [];
    }

    class Splash extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$v, null, safe_not_equal, {});
    	}
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function getTransitionDuration(element) {
      if (!element) return 0;

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } =
        window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (
        (Number.parseFloat(transitionDuration) +
          Number.parseFloat(transitionDelay)) *
        1000
      );
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.55.1 */

    function create_else_block_1$1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	return {
    		c() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler_1*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (37:0) {#if href}
    function create_if_block$d(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$8, create_else_block$c];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	return {
    		c() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen(a, "click", /*click_handler*/ ctx[20]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if_blocks[current_block_type_index].d();
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (66:6) {#if children}
    function create_if_block_2$7(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (65:10)        
    function fallback_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$7, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (50:4) {:else}
    function create_else_block$c(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (48:4) {#if children}
    function create_if_block_1$8(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$w(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$u, create_fragment$w, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});
    	}
    }

    /* src\client\pages\Landing.svelte generated by Svelte v3.55.1 */

    function create_default_slot$a(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Join now");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$v(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(button.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(button, detaching);
    		}
    	};
    }

    class Landing extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$v, safe_not_equal, {});
    	}
    }

    /* src\client\pages\SendToken.svelte generated by Svelte v3.55.1 */

    function instance$t($$self) {

    	onMount(async () => {
    		network_1("/api/auth/", "post", { user: {} }).then(response => {
    			console.log(response);
    		});
    	});

    	return [];
    }

    class SendToken extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$t, null, safe_not_equal, {});
    	}
    }

    /* src\client\pages\NotFound.svelte generated by Svelte v3.55.1 */

    function create_fragment$u(ctx) {
    	let h1;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = "404 Not Found";
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    		}
    	};
    }

    class NotFound extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$u, safe_not_equal, {});
    	}
    }

    function collapseOut(node, params) {
      const dimension = params.horizontal ? 'width' : 'height';
      node.style[dimension] = `${node.getBoundingClientRect()[dimension]}px`;
      node.classList.add('collapsing');
      node.classList.remove('collapse', 'show');
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t > 0) {
            node.style[dimension] = '';
          } else if (t === 0) {
            node.classList.remove('collapsing');
            node.classList.add('collapse');
          }
        }
      };
    }

    function collapseIn(node, params) {
      const horizontal = params.horizontal;
      const dimension = horizontal ? 'width' : 'height';
      node.classList.add('collapsing');
      node.classList.remove('collapse', 'show');
      node.style[dimension] = 0;
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t < 1) {
            if (horizontal) {
              node.style.width = `${node.scrollWidth}px`;
            } else {
              node.style.height = `${node.scrollHeight}px`;
            }
          } else {
            node.classList.remove('collapsing');
            node.classList.add('collapse', 'show');
            node.style[dimension] = '';
          }
        }
      };
    }

    const defaultToggleEvents = ['touchstart', 'click'];

    var toggle = (toggler, togglerFn) => {
      let unbindEvents;

      if (
        typeof toggler === 'string' &&
        typeof window !== 'undefined' &&
        document &&
        document.createElement
      ) {
        let selection = document.querySelectorAll(toggler);
        if (!selection.length) {
          selection = document.querySelectorAll(`#${toggler}`);
        }
        if (!selection.length) {
          throw new Error(
            `The target '${toggler}' could not be identified in the dom, tip: check spelling`
          );
        }

        defaultToggleEvents.forEach((event) => {
          selection.forEach((element) => {
            element.addEventListener(event, togglerFn);
          });
        });

        unbindEvents = () => {
          defaultToggleEvents.forEach((event) => {
            selection.forEach((element) => {
              element.removeEventListener(event, togglerFn);
            });
          });
        };
      }

      return () => {
        if (typeof unbindEvents === 'function') {
          unbindEvents();
          unbindEvents = undefined;
        }
      };
    };

    /* node_modules\sveltestrap\src\Collapse.svelte generated by Svelte v3.55.1 */

    function create_if_block$c(ctx) {
    	let div;
    	let div_style_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let div_levels = [
    		{
    			style: div_style_value = /*navbar*/ ctx[2] ? undefined : 'overflow: hidden;'
    		},
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[8] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(div, "introstart", /*introstart_handler*/ ctx[17]),
    					listen(div, "introend", /*introend_handler*/ ctx[18]),
    					listen(div, "outrostart", /*outrostart_handler*/ ctx[19]),
    					listen(div, "outroend", /*outroend_handler*/ ctx[20]),
    					listen(div, "introstart", function () {
    						if (is_function(/*onEntering*/ ctx[3])) /*onEntering*/ ctx[3].apply(this, arguments);
    					}),
    					listen(div, "introend", function () {
    						if (is_function(/*onEntered*/ ctx[4])) /*onEntered*/ ctx[4].apply(this, arguments);
    					}),
    					listen(div, "outrostart", function () {
    						if (is_function(/*onExiting*/ ctx[5])) /*onExiting*/ ctx[5].apply(this, arguments);
    					}),
    					listen(div, "outroend", function () {
    						if (is_function(/*onExited*/ ctx[6])) /*onExited*/ ctx[6].apply(this, arguments);
    					})
    				];

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*navbar*/ 4 && div_style_value !== (div_style_value = /*navbar*/ ctx[2] ? undefined : 'overflow: hidden;')) && { style: div_style_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 256) && { class: /*classes*/ ctx[8] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, collapseIn, { horizontal: /*horizontal*/ ctx[1] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, collapseOut, { horizontal: /*horizontal*/ ctx[1] });
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[21]);
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$c(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(window, "resize", /*onwindowresize*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"isOpen","class","horizontal","navbar","onEntering","onEntered","onExiting","onExited","expand","toggler"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher();
    	let { isOpen = false } = $$props;
    	let { class: className = '' } = $$props;
    	let { horizontal = false } = $$props;
    	let { navbar = false } = $$props;
    	let { onEntering = () => dispatch('opening') } = $$props;
    	let { onEntered = () => dispatch('open') } = $$props;
    	let { onExiting = () => dispatch('closing') } = $$props;
    	let { onExited = () => dispatch('close') } = $$props;
    	let { expand = false } = $$props;
    	let { toggler = null } = $$props;

    	onMount(() => toggle(toggler, e => {
    		$$invalidate(0, isOpen = !isOpen);
    		e.preventDefault();
    	}));

    	let windowWidth = 0;
    	let _wasMaximized = false;

    	// TODO wrong to hardcode these here - come from Bootstrap CSS only
    	const minWidth = {};

    	minWidth['xs'] = 0;
    	minWidth['sm'] = 576;
    	minWidth['md'] = 768;
    	minWidth['lg'] = 992;
    	minWidth['xl'] = 1200;

    	function notify() {
    		dispatch('update', isOpen);
    	}

    	function introstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function introend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outrostart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outroend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(7, windowWidth = window.innerWidth);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('horizontal' in $$new_props) $$invalidate(1, horizontal = $$new_props.horizontal);
    		if ('navbar' in $$new_props) $$invalidate(2, navbar = $$new_props.navbar);
    		if ('onEntering' in $$new_props) $$invalidate(3, onEntering = $$new_props.onEntering);
    		if ('onEntered' in $$new_props) $$invalidate(4, onEntered = $$new_props.onEntered);
    		if ('onExiting' in $$new_props) $$invalidate(5, onExiting = $$new_props.onExiting);
    		if ('onExited' in $$new_props) $$invalidate(6, onExited = $$new_props.onExited);
    		if ('expand' in $$new_props) $$invalidate(11, expand = $$new_props.expand);
    		if ('toggler' in $$new_props) $$invalidate(12, toggler = $$new_props.toggler);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, horizontal, navbar*/ 1030) {
    			$$invalidate(8, classes = classnames(className, {
    				'collapse-horizontal': horizontal,
    				'navbar-collapse': navbar
    			}));
    		}

    		if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximized*/ 26757) {
    			if (navbar && expand) {
    				if (windowWidth >= minWidth[expand] && !isOpen) {
    					$$invalidate(0, isOpen = true);
    					$$invalidate(13, _wasMaximized = true);
    					notify();
    				} else if (windowWidth < minWidth[expand] && _wasMaximized) {
    					$$invalidate(0, isOpen = false);
    					$$invalidate(13, _wasMaximized = false);
    					notify();
    				}
    			}
    		}
    	};

    	return [
    		isOpen,
    		horizontal,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		windowWidth,
    		classes,
    		$$restProps,
    		className,
    		expand,
    		toggler,
    		_wasMaximized,
    		minWidth,
    		$$scope,
    		slots,
    		introstart_handler,
    		introend_handler,
    		outrostart_handler,
    		outroend_handler,
    		onwindowresize
    	];
    }

    class Collapse extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$s, create_fragment$t, safe_not_equal, {
    			isOpen: 0,
    			class: 10,
    			horizontal: 1,
    			navbar: 2,
    			onEntering: 3,
    			onEntered: 4,
    			onExiting: 5,
    			onExited: 6,
    			expand: 11,
    			toggler: 12
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getUAString() {
      var uaData = navigator.userAgentData;

      if (uaData != null && uaData.brands) {
        return uaData.brands.map(function (item) {
          return item.brand + "/" + item.version;
        }).join(' ');
      }

      return navigator.userAgent;
    }

    function isLayoutViewport() {
      return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }

    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }

      var clientRect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (includeScale && isHTMLElement(element)) {
        scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
      }

      var _ref = isElement(element) ? getWindow(element) : window,
          visualViewport = _ref.visualViewport;

      var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
      var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
      var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
      var width = clientRect.width / scaleX;
      var height = clientRect.height / scaleY;
      return {
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x: x,
        y: y
      };
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = /firefox/i.test(getUAString());
      var isIE = /Trident/i.test(getUAString());

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    function getViewportRect(element, strategy) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0;

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = isLayoutViewport();

        if (layoutViewport || !layoutViewport && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element, strategy) {
      var rect = getBoundingClientRect(element, false, strategy === 'fixed');
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent, strategy) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary, strategy) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent, strategy));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$strategy = _options.strategy,
          strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });

            for (var index = 0; index < state.orderedModifiers.length; index++) {

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }

    var passive = {
      passive: true
    };

    function effect$2(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect$2,
      data: {}
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$1(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$1,
      requires: ['computeStyles']
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    // Code derived from https://github.com/bryanmylee/svelte-popperjs/blob/master/src/index.ts
    function createPopperActions(initOptions) {
      let contentNode;
      let options = initOptions;
      let popperInstance = null;
      let referenceNode;

      const initPopper = () => {
        if (referenceNode && contentNode) {
          popperInstance = createPopper(referenceNode, contentNode, options);
        }
      };

      const deinitPopper = () => {
        if (popperInstance) {
          popperInstance.destroy();
          popperInstance = null;
        }
      };

      const referenceAction = (node) => {
        referenceNode = node;
        initPopper();
        return {
          destroy() {
            deinitPopper();
          }
        };
      };

      const contentAction = (node, contentOptions) => {
        contentNode = node;
        options = Object.assign(Object.assign({}, initOptions), contentOptions);
        initPopper();

        return {
          update(newContentOptions) {
            options = Object.assign(
              Object.assign({}, initOptions),
              newContentOptions
            );
            if (popperInstance && options) {
              popperInstance.setOptions(options);
            }
          },
          destroy() {
            deinitPopper();
          }
        };
      };

      return [referenceAction, contentAction, () => popperInstance];
    }

    const createContext = () => writable$1({});

    /* node_modules\sveltestrap\src\Dropdown.svelte generated by Svelte v3.55.1 */

    function create_else_block$b(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let div_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[20](div);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[20](null);
    		}
    	};
    }

    // (119:0) {#if nav}
    function create_if_block$b(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let li_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	return {
    		c() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			/*li_binding*/ ctx[19](li);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if (default_slot) default_slot.d(detaching);
    			/*li_binding*/ ctx[19](null);
    		}
    	};
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$b];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let subItemIsActive;
    	let classes;
    	let handleToggle;

    	const omit_props_names = [
    		"class","active","direction","dropup","group","inNavbar","isOpen","nav","setActiveFromChild","size","toggle"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const noop = () => undefined;
    	let context = createContext();
    	setContext('dropdownContext', context);
    	const navbarContext = getContext('navbar');
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { direction = 'down' } = $$props;
    	let { dropup = false } = $$props;
    	let { group = false } = $$props;
    	let { inNavbar = navbarContext ? navbarContext.inNavbar : false } = $$props;
    	let { isOpen = false } = $$props;
    	let { nav = false } = $$props;
    	let { setActiveFromChild = false } = $$props;
    	let { size = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	const [popperRef, popperContent] = createPopperActions();
    	const validDirections = ['up', 'down', 'left', 'right', 'start', 'end'];

    	if (validDirections.indexOf(direction) === -1) {
    		throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
    	}

    	let component;
    	let dropdownDirection;

    	function handleDocumentClick(e) {
    		if (e && (e.which === 3 || e.type === 'keyup' && e.which !== 9)) return;

    		if (component.contains(e.target) && component !== e.target && (e.type !== 'keyup' || e.which === 9)) {
    			return;
    		}

    		handleToggle(e);
    	}

    	onDestroy(() => {
    		if (typeof document !== 'undefined') {
    			['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    		}
    	});

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			component = $$value;
    			$$invalidate(1, component);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			component = $$value;
    			$$invalidate(1, component);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ('direction' in $$new_props) $$invalidate(7, direction = $$new_props.direction);
    		if ('dropup' in $$new_props) $$invalidate(8, dropup = $$new_props.dropup);
    		if ('group' in $$new_props) $$invalidate(9, group = $$new_props.group);
    		if ('inNavbar' in $$new_props) $$invalidate(10, inNavbar = $$new_props.inNavbar);
    		if ('isOpen' in $$new_props) $$invalidate(4, isOpen = $$new_props.isOpen);
    		if ('nav' in $$new_props) $$invalidate(0, nav = $$new_props.nav);
    		if ('setActiveFromChild' in $$new_props) $$invalidate(11, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ('size' in $$new_props) $$invalidate(12, size = $$new_props.size);
    		if ('toggle' in $$new_props) $$invalidate(13, toggle = $$new_props.toggle);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*setActiveFromChild, component*/ 2050) {
    			$$invalidate(16, subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === 'function' && component.querySelector('.active')));
    		}

    		if ($$self.$$.dirty & /*direction*/ 128) {
    			{
    				if (direction === 'left') $$invalidate(14, dropdownDirection = 'start'); else if (direction === 'right') $$invalidate(14, dropdownDirection = 'end'); else $$invalidate(14, dropdownDirection = direction);
    			}
    		}

    		if ($$self.$$.dirty & /*toggle, isOpen*/ 8208) {
    			$$invalidate(15, handleToggle = toggle || (() => $$invalidate(4, isOpen = !isOpen)));
    		}

    		if ($$self.$$.dirty & /*className, direction, dropdownDirection, nav, active, setActiveFromChild, subItemIsActive, group, size, isOpen*/ 88817) {
    			$$invalidate(2, classes = classnames(className, direction !== 'down' && `drop${dropdownDirection}`, nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, {
    				'btn-group': group,
    				[`btn-group-${size}`]: !!size,
    				dropdown: !group,
    				show: isOpen,
    				'nav-item': nav
    			}));
    		}

    		if ($$self.$$.dirty & /*isOpen*/ 16) {
    			{
    				if (typeof document !== 'undefined') {
    					if (isOpen) {
    						['click', 'touchstart', 'keyup'].forEach(event => document.addEventListener(event, handleDocumentClick, true));
    					} else {
    						['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*handleToggle, isOpen, direction, dropup, nav, inNavbar*/ 34193) {
    			{
    				context.update(() => {
    					return {
    						toggle: handleToggle,
    						isOpen,
    						direction: direction === 'down' && dropup ? 'up' : direction,
    						inNavbar: nav || inNavbar,
    						popperRef: nav ? noop : popperRef,
    						popperContent: nav ? noop : popperContent
    					};
    				});
    			}
    		}
    	};

    	return [
    		nav,
    		component,
    		classes,
    		$$restProps,
    		isOpen,
    		className,
    		active,
    		direction,
    		dropup,
    		group,
    		inNavbar,
    		setActiveFromChild,
    		size,
    		toggle,
    		dropdownDirection,
    		handleToggle,
    		subItemIsActive,
    		$$scope,
    		slots,
    		li_binding,
    		div_binding
    	];
    }

    class Dropdown extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$r, create_fragment$s, safe_not_equal, {
    			class: 5,
    			active: 6,
    			direction: 7,
    			dropup: 8,
    			group: 9,
    			inNavbar: 10,
    			isOpen: 4,
    			nav: 0,
    			setActiveFromChild: 11,
    			size: 12,
    			toggle: 13
    		});
    	}
    }

    /* node_modules\sveltestrap\src\CardBody.svelte generated by Svelte v3.55.1 */

    function create_fragment$r(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'card-body'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardBody extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$q, create_fragment$r, safe_not_equal, { class: 2 });
    	}
    }

    /* node_modules\sveltestrap\src\CardHeader.svelte generated by Svelte v3.55.1 */

    function create_else_block$a(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(div, "click", /*click_handler_1*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (11:0) {#if tag === 'h3'}
    function create_if_block$a(ctx) {
    	let h3;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let h3_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let h3_data = {};

    	for (let i = 0; i < h3_levels.length; i += 1) {
    		h3_data = assign(h3_data, h3_levels[i]);
    	}

    	return {
    		c() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			set_attributes(h3, h3_data);
    		},
    		m(target, anchor) {
    			insert(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(h3, "click", /*click_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h3, h3_data = get_spread_update(h3_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h3);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$q(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === 'h3') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { tag = 'div' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('tag' in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, 'card-header'));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class CardHeader extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$p, create_fragment$q, safe_not_equal, { class: 3, tag: 0 });
    	}
    }

    /* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.55.1 */

    function create_fragment$p(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","sm","md","lg","xl","xxl","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('sm' in $$new_props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$new_props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, sm, md, lg, xl, xxl, fluid*/ 508) {
    			$$invalidate(0, classes = classnames(className, {
    				'container-sm': sm,
    				'container-md': md,
    				'container-lg': lg,
    				'container-xl': xl,
    				'container-xxl': xxl,
    				'container-fluid': fluid,
    				container: !sm && !md && !lg && !xl && !xxl && !fluid
    			}));
    		}
    	};

    	return [classes, $$restProps, className, sm, md, lg, xl, xxl, fluid, $$scope, slots];
    }

    class Container extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$o, create_fragment$p, safe_not_equal, {
    			class: 2,
    			sm: 3,
    			md: 4,
    			lg: 5,
    			xl: 6,
    			xxl: 7,
    			fluid: 8
    		});
    	}
    }

    /* node_modules\sveltestrap\src\DropdownItem.svelte generated by Svelte v3.55.1 */

    function create_else_block$9(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let button_levels = [{ type: "button" }, /*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	return {
    		c() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button, "click", /*click_handler_2*/ ctx[15]),
    					listen(button, "click", /*handleItemClick*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (45:15) 
    function create_if_block_2$6(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[6],
    		{ click: "" },
    		{ href: /*href*/ ctx[2] },
    		{ class: /*classes*/ ctx[3] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	return {
    		c() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(a, "click", /*handleItemClick*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				{ click: "" },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (41:18) 
    function create_if_block_1$7(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let div_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(div, "click", /*click_handler_1*/ ctx[14]),
    					listen(div, "click", /*handleItemClick*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (37:0) {#if header}
    function create_if_block$9(ctx) {
    	let h6;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let h6_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let h6_data = {};

    	for (let i = 0; i < h6_levels.length; i += 1) {
    		h6_data = assign(h6_data, h6_levels[i]);
    	}

    	return {
    		c() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			set_attributes(h6, h6_data);
    		},
    		m(target, anchor) {
    			insert(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(h6, "click", /*click_handler*/ ctx[13]),
    					listen(h6, "click", /*handleItemClick*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h6, h6_data = get_spread_update(h6_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h6);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$o(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_if_block_1$7, create_if_block_2$6, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[1]) return 0;
    		if (/*divider*/ ctx[0]) return 1;
    		if (/*href*/ ctx[2]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active","disabled","divider","header","toggle","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const context = getContext('dropdownContext');
    	component_subscribe($$self, context, value => $$invalidate(16, $context = value));
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	let { divider = false } = $$props;
    	let { header = false } = $$props;
    	let { toggle = true } = $$props;
    	let { href = '' } = $$props;

    	function handleItemClick(e) {
    		if (disabled || header || divider) {
    			e.preventDefault();
    			return;
    		}

    		if (toggle) {
    			$context.toggle(e);
    		}
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(8, active = $$new_props.active);
    		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('divider' in $$new_props) $$invalidate(0, divider = $$new_props.divider);
    		if ('header' in $$new_props) $$invalidate(1, header = $$new_props.header);
    		if ('toggle' in $$new_props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, divider, header, active*/ 899) {
    			$$invalidate(3, classes = classnames(className, {
    				disabled,
    				'dropdown-item': !divider && !header,
    				active,
    				'dropdown-header': header,
    				'dropdown-divider': divider
    			}));
    		}
    	};

    	return [
    		divider,
    		header,
    		href,
    		classes,
    		context,
    		handleItemClick,
    		$$restProps,
    		className,
    		active,
    		disabled,
    		toggle,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class DropdownItem extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$n, create_fragment$o, safe_not_equal, {
    			class: 7,
    			active: 8,
    			disabled: 9,
    			divider: 0,
    			header: 1,
    			toggle: 10,
    			href: 2
    		});
    	}
    }

    /* node_modules\sveltestrap\src\DropdownMenu.svelte generated by Svelte v3.55.1 */

    function create_fragment$n(ctx) {
    	let div;
    	let div_data_bs_popper_value;
    	let $context_popperContent_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[4],
    		{ class: /*classes*/ ctx[1] },
    		{
    			"data-bs-popper": div_data_bs_popper_value = /*$context*/ ctx[0].inNavbar ? 'static' : undefined
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer($context_popperContent_action = /*$context*/ ctx[0].popperContent(div, /*popperOptions*/ ctx[2]));
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*$context*/ 1 && div_data_bs_popper_value !== (div_data_bs_popper_value = /*$context*/ ctx[0].inNavbar ? 'static' : undefined)) && {
    					"data-bs-popper": div_data_bs_popper_value
    				}
    			]));

    			if ($context_popperContent_action && is_function($context_popperContent_action.update) && dirty & /*popperOptions*/ 4) $context_popperContent_action.update.call(null, /*popperOptions*/ ctx[2]);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let popperOptions;
    	let classes;
    	const omit_props_names = ["class","dark","end","right"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const context = getContext('dropdownContext');
    	component_subscribe($$self, context, value => $$invalidate(0, $context = value));
    	let { class: className = '' } = $$props;
    	let { dark = false } = $$props;
    	let { end = false } = $$props;
    	let { right = false } = $$props;

    	const popperPlacement = (direction, end) => {
    		let prefix = direction;
    		if (direction === 'up') prefix = 'top'; else if (direction === 'down') prefix = 'bottom';
    		let suffix = end ? 'end' : 'start';
    		return `${prefix}-${suffix}`;
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('dark' in $$new_props) $$invalidate(6, dark = $$new_props.dark);
    		if ('end' in $$new_props) $$invalidate(7, end = $$new_props.end);
    		if ('right' in $$new_props) $$invalidate(8, right = $$new_props.right);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context, end, right*/ 385) {
    			$$invalidate(2, popperOptions = {
    				modifiers: [
    					{ name: 'flip' },
    					{
    						name: 'offset',
    						options: { offset: [0, 2] }
    					}
    				],
    				placement: popperPlacement($context.direction, end || right)
    			});
    		}

    		if ($$self.$$.dirty & /*className, dark, end, right, $context*/ 481) {
    			$$invalidate(1, classes = classnames(className, 'dropdown-menu', {
    				'dropdown-menu-dark': dark,
    				'dropdown-menu-end': end || right,
    				show: $context.isOpen
    			}));
    		}
    	};

    	return [
    		$context,
    		classes,
    		popperOptions,
    		context,
    		$$restProps,
    		className,
    		dark,
    		end,
    		right,
    		$$scope,
    		slots
    	];
    }

    class DropdownMenu extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$m, create_fragment$n, safe_not_equal, { class: 5, dark: 6, end: 7, right: 8 });
    	}
    }

    /* node_modules\sveltestrap\src\DropdownToggle.svelte generated by Svelte v3.55.1 */

    function create_else_block$8(ctx) {
    	let button;
    	let button_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_3(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ type: "button" },
    		{
    			"aria-expanded": button_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*btnClasses*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	return {
    		c() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[28](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(button)),
    					listen(button, "click", /*click_handler_3*/ ctx[24]),
    					listen(button, "click", /*toggleButton*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				{ type: "button" },
    				(!current || dirty & /*$context*/ 64 && button_aria_expanded_value !== (button_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
    					"aria-expanded": button_aria_expanded_value
    				},
    				(!current || dirty & /*btnClasses*/ 32) && { class: /*btnClasses*/ ctx[5] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[28](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (80:25) 
    function create_if_block_2$5(ctx) {
    	let span;
    	let span_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

    	let span_levels = [
    		/*$$restProps*/ ctx[9],
    		{
    			"aria-expanded": span_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	return {
    		c() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(span, span_data);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			/*span_binding*/ ctx[27](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(span)),
    					listen(span, "click", /*click_handler_2*/ ctx[23]),
    					listen(span, "click", /*toggleButton*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*$context*/ 64 && span_aria_expanded_value !== (span_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
    					"aria-expanded": span_aria_expanded_value
    				},
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*span_binding*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (66:24) 
    function create_if_block_1$6(ctx) {
    	let div;
    	let div_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	let div_levels = [
    		/*$$restProps*/ ctx[9],
    		{
    			"aria-expanded": div_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			/*div_binding*/ ctx[26](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(div)),
    					listen(div, "click", /*click_handler_1*/ ctx[22]),
    					listen(div, "click", /*toggleButton*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*$context*/ 64 && div_aria_expanded_value !== (div_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": div_aria_expanded_value },
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*div_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (51:0) {#if nav}
    function create_if_block$8(ctx) {
    	let a;
    	let a_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ href: "#nav" },
    		{
    			"aria-expanded": a_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	return {
    		c() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[25](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(a)),
    					listen(a, "click", /*click_handler*/ ctx[21]),
    					listen(a, "click", /*toggleButton*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				{ href: "#nav" },
    				(!current || dirty & /*$context*/ 64 && a_aria_expanded_value !== (a_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": a_aria_expanded_value },
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (105:10)        
    function fallback_block_3(ctx) {
    	let span;
    	let t;

    	return {
    		c() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr(span, "class", "visually-hidden");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data(t, /*ariaLabel*/ ctx[1]);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (90:10)        
    function fallback_block_2(ctx) {
    	let span;
    	let t;

    	return {
    		c() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr(span, "class", "visually-hidden");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data(t, /*ariaLabel*/ ctx[1]);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (76:10)        
    function fallback_block_1(ctx) {
    	let span;
    	let t;

    	return {
    		c() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr(span, "class", "visually-hidden");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data(t, /*ariaLabel*/ ctx[1]);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (62:10)        
    function fallback_block$2(ctx) {
    	let span;
    	let t;

    	return {
    		c() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr(span, "class", "visually-hidden");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data(t, /*ariaLabel*/ ctx[1]);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    function create_fragment$m(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_if_block_1$6, create_if_block_2$5, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[2]) return 0;
    		if (/*tag*/ ctx[3] === 'div') return 1;
    		if (/*tag*/ ctx[3] === 'span') return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let classes;
    	let btnClasses;

    	const omit_props_names = [
    		"class","ariaLabel","active","block","caret","color","disabled","inner","nav","outline","size","split","tag"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const context = getContext('dropdownContext');
    	component_subscribe($$self, context, value => $$invalidate(6, $context = value));
    	let { class: className = '' } = $$props;
    	let { ariaLabel = 'Toggle Dropdown' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { caret = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { inner = undefined } = $$props;
    	let { nav = false } = $$props;
    	let { outline = false } = $$props;
    	let { size = '' } = $$props;
    	let { split = false } = $$props;
    	let { tag = null } = $$props;

    	function toggleButton(e) {
    		if (disabled) {
    			e.preventDefault();
    			return;
    		}

    		if (nav) {
    			e.preventDefault();
    		}

    		$context.toggle(e);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('ariaLabel' in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('caret' in $$new_props) $$invalidate(13, caret = $$new_props.caret);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(15, disabled = $$new_props.disabled);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('nav' in $$new_props) $$invalidate(2, nav = $$new_props.nav);
    		if ('outline' in $$new_props) $$invalidate(16, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(17, size = $$new_props.size);
    		if ('split' in $$new_props) $$invalidate(18, split = $$new_props.split);
    		if ('tag' in $$new_props) $$invalidate(3, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, caret, split, nav*/ 271364) {
    			$$invalidate(4, classes = classnames(className, {
    				'dropdown-toggle': caret || split,
    				'dropdown-toggle-split': split,
    				'nav-link': nav
    			}));
    		}

    		if ($$self.$$.dirty & /*classes, outline, color, size, block, active*/ 219152) {
    			$$invalidate(5, btnClasses = classnames(classes, 'btn', `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, { active }));
    		}
    	};

    	return [
    		inner,
    		ariaLabel,
    		nav,
    		tag,
    		classes,
    		btnClasses,
    		$context,
    		context,
    		toggleButton,
    		$$restProps,
    		className,
    		active,
    		block,
    		caret,
    		color,
    		disabled,
    		outline,
    		size,
    		split,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		a_binding,
    		div_binding,
    		span_binding,
    		button_binding
    	];
    }

    class DropdownToggle extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$l, create_fragment$m, safe_not_equal, {
    			class: 10,
    			ariaLabel: 1,
    			active: 11,
    			block: 12,
    			caret: 13,
    			color: 14,
    			disabled: 15,
    			inner: 0,
    			nav: 2,
    			outline: 16,
    			size: 17,
    			split: 18,
    			tag: 3
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Form.svelte generated by Svelte v3.55.1 */

    function create_fragment$l(ctx) {
    	let form;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let form_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let form_data = {};

    	for (let i = 0; i < form_levels.length; i += 1) {
    		form_data = assign(form_data, form_levels[i]);
    	}

    	return {
    		c() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			set_attributes(form, form_data);
    		},
    		m(target, anchor) {
    			insert(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(form, "submit", /*submit_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(form, form_data = get_spread_update(form_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","inline","validated"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { inline = false } = $$props;
    	let { validated = false } = $$props;

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('inline' in $$new_props) $$invalidate(3, inline = $$new_props.inline);
    		if ('validated' in $$new_props) $$invalidate(4, validated = $$new_props.validated);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, inline, validated*/ 28) {
    			$$invalidate(0, classes = classnames(className, {
    				'form-inline': inline,
    				'was-validated': validated
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		inline,
    		validated,
    		$$scope,
    		slots,
    		submit_handler
    	];
    }

    class Form extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$k, create_fragment$l, safe_not_equal, { class: 2, inline: 3, validated: 4 });
    	}
    }

    /* node_modules\sveltestrap\src\FormCheck.svelte generated by Svelte v3.55.1 */
    const get_label_slot_changes$1 = dirty => ({});
    const get_label_slot_context$1 = ctx => ({});

    // (66:2) {:else}
    function create_else_block$7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[11],
    		{ class: /*inputClasses*/ ctx[9] },
    		{ id: /*idFor*/ ctx[8] },
    		{ type: "checkbox" },
    		{ disabled: /*disabled*/ ctx[3] },
    		{ name: /*name*/ ctx[5] },
    		{ __value: /*value*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			/*input_binding_2*/ ctx[38](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_2*/ ctx[28]),
    					listen(input, "change", /*change_handler_2*/ ctx[29]),
    					listen(input, "focus", /*focus_handler_2*/ ctx[30]),
    					listen(input, "input", /*input_handler_2*/ ctx[31]),
    					listen(input, "change", /*input_change_handler_2*/ ctx[37])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11],
    				dirty[0] & /*inputClasses*/ 512 && { class: /*inputClasses*/ ctx[9] },
    				dirty[0] & /*idFor*/ 256 && { id: /*idFor*/ ctx[8] },
    				{ type: "checkbox" },
    				dirty[0] & /*disabled*/ 8 && { disabled: /*disabled*/ ctx[3] },
    				dirty[0] & /*name*/ 32 && { name: /*name*/ ctx[5] },
    				dirty[0] & /*value*/ 128 && { __value: /*value*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_2*/ ctx[38](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (50:30) 
    function create_if_block_2$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[11],
    		{ class: /*inputClasses*/ ctx[9] },
    		{ id: /*idFor*/ ctx[8] },
    		{ type: "checkbox" },
    		{ disabled: /*disabled*/ ctx[3] },
    		{ name: /*name*/ ctx[5] },
    		{ __value: /*value*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			/*input_binding_1*/ ctx[36](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_1*/ ctx[24]),
    					listen(input, "change", /*change_handler_1*/ ctx[25]),
    					listen(input, "focus", /*focus_handler_1*/ ctx[26]),
    					listen(input, "input", /*input_handler_1*/ ctx[27]),
    					listen(input, "change", /*input_change_handler_1*/ ctx[35])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11],
    				dirty[0] & /*inputClasses*/ 512 && { class: /*inputClasses*/ ctx[9] },
    				dirty[0] & /*idFor*/ 256 && { id: /*idFor*/ ctx[8] },
    				{ type: "checkbox" },
    				dirty[0] & /*disabled*/ 8 && { disabled: /*disabled*/ ctx[3] },
    				dirty[0] & /*name*/ 32 && { name: /*name*/ ctx[5] },
    				dirty[0] & /*value*/ 128 && { __value: /*value*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_1*/ ctx[36](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (34:2) {#if type === 'radio'}
    function create_if_block_1$5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[11],
    		{ class: /*inputClasses*/ ctx[9] },
    		{ id: /*idFor*/ ctx[8] },
    		{ type: "radio" },
    		{ disabled: /*disabled*/ ctx[3] },
    		{ name: /*name*/ ctx[5] },
    		{ __value: /*value*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[33][0].push(input);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*group*/ ctx[1];
    			/*input_binding*/ ctx[34](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler*/ ctx[20]),
    					listen(input, "change", /*change_handler*/ ctx[21]),
    					listen(input, "focus", /*focus_handler*/ ctx[22]),
    					listen(input, "input", /*input_handler*/ ctx[23]),
    					listen(input, "change", /*input_change_handler*/ ctx[32])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11],
    				dirty[0] & /*inputClasses*/ 512 && { class: /*inputClasses*/ ctx[9] },
    				dirty[0] & /*idFor*/ 256 && { id: /*idFor*/ ctx[8] },
    				{ type: "radio" },
    				dirty[0] & /*disabled*/ 8 && { disabled: /*disabled*/ ctx[3] },
    				dirty[0] & /*name*/ 32 && { name: /*name*/ ctx[5] },
    				dirty[0] & /*value*/ 128 && { __value: /*value*/ ctx[7] }
    			]));

    			if (dirty[0] & /*group*/ 2) {
    				input.checked = input.__value === /*group*/ ctx[1];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			/*$$binding_groups*/ ctx[33][0].splice(/*$$binding_groups*/ ctx[33][0].indexOf(input), 1);
    			/*input_binding*/ ctx[34](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (83:2) {#if label}
    function create_if_block$7(ctx) {
    	let label_1;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[19].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[18], get_label_slot_context$1);
    	const label_slot_or_fallback = label_slot || fallback_block$1(ctx);

    	return {
    		c() {
    			label_1 = element("label");
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    			attr(label_1, "class", "form-check-label");
    			attr(label_1, "for", /*idFor*/ ctx[8]);
    		},
    		m(target, anchor) {
    			insert(target, label_1, anchor);

    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(label_1, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[18], dirty, get_label_slot_changes$1),
    						get_label_slot_context$1
    					);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & /*label*/ 16)) {
    					label_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*idFor*/ 256) {
    				attr(label_1, "for", /*idFor*/ ctx[8]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label_1);
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    		}
    	};
    }

    // (85:25) {label}
    function fallback_block$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*label*/ ctx[4]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*label*/ 16) set_data(t, /*label*/ ctx[4]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$k(ctx) {
    	let div;
    	let t;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[6] === 'radio') return create_if_block_1$5;
    		if (/*type*/ ctx[6] === 'switch') return create_if_block_2$4;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*label*/ ctx[4] && create_if_block$7(ctx);

    	return {
    		c() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr(div, "class", /*classes*/ ctx[10]);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if_block0.m(div, null);
    			append(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			}

    			if (/*label*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*label*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*classes*/ 1024) {
    				attr(div, "class", /*classes*/ ctx[10]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	let inputClasses;
    	let idFor;

    	const omit_props_names = [
    		"class","checked","disabled","group","id","inline","inner","invalid","label","name","size","type","valid","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { checked = false } = $$props;
    	let { disabled = false } = $$props;
    	let { group = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { inline = false } = $$props;
    	let { inner = undefined } = $$props;
    	let { invalid = false } = $$props;
    	let { label = '' } = $$props;
    	let { name = '' } = $$props;
    	let { size = '' } = $$props;
    	let { type = 'checkbox' } = $$props;
    	let { valid = false } = $$props;
    	let { value = undefined } = $$props;
    	const $$binding_groups = [[]];

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(1, group);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(2, inner);
    		});
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(2, inner);
    		});
    	}

    	function input_change_handler_2() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	function input_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(2, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(12, className = $$new_props.class);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('group' in $$new_props) $$invalidate(1, group = $$new_props.group);
    		if ('id' in $$new_props) $$invalidate(13, id = $$new_props.id);
    		if ('inline' in $$new_props) $$invalidate(14, inline = $$new_props.inline);
    		if ('inner' in $$new_props) $$invalidate(2, inner = $$new_props.inner);
    		if ('invalid' in $$new_props) $$invalidate(15, invalid = $$new_props.invalid);
    		if ('label' in $$new_props) $$invalidate(4, label = $$new_props.label);
    		if ('name' in $$new_props) $$invalidate(5, name = $$new_props.name);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(6, type = $$new_props.type);
    		if ('valid' in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ('value' in $$new_props) $$invalidate(7, value = $$new_props.value);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, type, inline, size*/ 86080) {
    			$$invalidate(10, classes = classnames(className, 'form-check', {
    				'form-switch': type === 'switch',
    				'form-check-inline': inline,
    				[`form-control-${size}`]: size
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*invalid, valid*/ 163840) {
    			$$invalidate(9, inputClasses = classnames('form-check-input', { 'is-invalid': invalid, 'is-valid': valid }));
    		}

    		if ($$self.$$.dirty[0] & /*id, label*/ 8208) {
    			$$invalidate(8, idFor = id || label);
    		}
    	};

    	return [
    		checked,
    		group,
    		inner,
    		disabled,
    		label,
    		name,
    		type,
    		value,
    		idFor,
    		inputClasses,
    		classes,
    		$$restProps,
    		className,
    		id,
    		inline,
    		invalid,
    		size,
    		valid,
    		$$scope,
    		slots,
    		blur_handler,
    		change_handler,
    		focus_handler,
    		input_handler,
    		blur_handler_1,
    		change_handler_1,
    		focus_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		change_handler_2,
    		focus_handler_2,
    		input_handler_2,
    		input_change_handler,
    		$$binding_groups,
    		input_binding,
    		input_change_handler_1,
    		input_binding_1,
    		input_change_handler_2,
    		input_binding_2
    	];
    }

    class FormCheck extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$k,
    			safe_not_equal,
    			{
    				class: 12,
    				checked: 0,
    				disabled: 3,
    				group: 1,
    				id: 13,
    				inline: 14,
    				inner: 2,
    				invalid: 15,
    				label: 4,
    				name: 5,
    				size: 16,
    				type: 6,
    				valid: 17,
    				value: 7
    			},
    			null,
    			[-1, -1]
    		);
    	}
    }

    /* node_modules\sveltestrap\src\FormFeedback.svelte generated by Svelte v3.55.1 */

    function create_fragment$j(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","valid","tooltip"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { valid = undefined } = $$props;
    	let { tooltip = false } = $$props;
    	let classes;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('valid' in $$new_props) $$invalidate(3, valid = $$new_props.valid);
    		if ('tooltip' in $$new_props) $$invalidate(4, tooltip = $$new_props.tooltip);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tooltip, className, valid*/ 28) {
    			{
    				const validMode = tooltip ? 'tooltip' : 'feedback';
    				$$invalidate(0, classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`));
    			}
    		}
    	};

    	return [classes, $$restProps, className, valid, tooltip, $$scope, slots];
    }

    class FormFeedback extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$i, create_fragment$j, safe_not_equal, { class: 2, valid: 3, tooltip: 4 });
    	}
    }

    /* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.55.1 */
    const get_label_slot_changes_1 = dirty => ({});
    const get_label_slot_context_1 = ctx => ({});
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (34:0) {:else}
    function create_else_block$6(ctx) {
    	let div;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let if_block = (/*label*/ ctx[0] || /*$$slots*/ ctx[4].label) && create_if_block_2$3(ctx);
    	let div_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*label*/ ctx[0] || /*$$slots*/ ctx[4].label) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*label, $$slots*/ 17) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (23:0) {#if tag === 'fieldset'}
    function create_if_block$6(ctx) {
    	let fieldset;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let if_block = (/*label*/ ctx[0] || /*$$slots*/ ctx[4].label) && create_if_block_1$4(ctx);
    	let fieldset_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	return {
    		c() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(fieldset, fieldset_data);
    		},
    		m(target, anchor) {
    			insert(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			append(fieldset, t);
    			if (if_block) if_block.m(fieldset, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*label*/ ctx[0] || /*$$slots*/ ctx[4].label) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*label, $$slots*/ 17) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(fieldset, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(fieldset);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (37:4) {#if label || $$slots.label}
    function create_if_block_2$3(ctx) {
    	let label_1;
    	let t0;
    	let t1;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[12].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[11], get_label_slot_context_1);

    	return {
    		c() {
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			if (label_slot) label_slot.c();
    		},
    		m(target, anchor) {
    			insert(target, label_1, anchor);
    			append(label_1, t0);
    			append(label_1, t1);

    			if (label_slot) {
    				label_slot.m(label_1, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (!current || dirty & /*label*/ 1) set_data(t0, /*label*/ ctx[0]);

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[11], dirty, get_label_slot_changes_1),
    						get_label_slot_context_1
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label_1);
    			if (label_slot) label_slot.d(detaching);
    		}
    	};
    }

    // (26:4) {#if label || $$slots.label}
    function create_if_block_1$4(ctx) {
    	let label_1;
    	let t0;
    	let t1;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[12].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[11], get_label_slot_context);

    	return {
    		c() {
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			if (label_slot) label_slot.c();
    		},
    		m(target, anchor) {
    			insert(target, label_1, anchor);
    			append(label_1, t0);
    			append(label_1, t1);

    			if (label_slot) {
    				label_slot.m(label_1, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (!current || dirty & /*label*/ 1) set_data(t0, /*label*/ ctx[0]);

    			if (label_slot) {
    				if (label_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						label_slot,
    						label_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(label_slot_template, /*$$scope*/ ctx[11], dirty, get_label_slot_changes),
    						get_label_slot_context
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label_1);
    			if (label_slot) label_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[1] === 'fieldset') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","check","disabled","floating","inline","label","row","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const $$slots = compute_slots(slots);
    	let { class: className = '' } = $$props;
    	let { check = false } = $$props;
    	let { disabled = false } = $$props;
    	let { floating = false } = $$props;
    	let { inline = false } = $$props;
    	let { label = '' } = $$props;
    	let { row = false } = $$props;
    	let { tag = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('check' in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ('disabled' in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('floating' in $$new_props) $$invalidate(8, floating = $$new_props.floating);
    		if ('inline' in $$new_props) $$invalidate(9, inline = $$new_props.inline);
    		if ('label' in $$new_props) $$invalidate(0, label = $$new_props.label);
    		if ('row' in $$new_props) $$invalidate(10, row = $$new_props.row);
    		if ('tag' in $$new_props) $$invalidate(1, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, floating, disabled*/ 2016) {
    			$$invalidate(2, classes = classnames(className, 'mb-3', {
    				row,
    				'form-check': check,
    				'form-check-inline': check && inline,
    				'form-floating': floating,
    				disabled: check && disabled
    			}));
    		}
    	};

    	return [
    		label,
    		tag,
    		classes,
    		$$restProps,
    		$$slots,
    		className,
    		check,
    		disabled,
    		floating,
    		inline,
    		row,
    		$$scope,
    		slots
    	];
    }

    class FormGroup extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$h, create_fragment$i, safe_not_equal, {
    			class: 5,
    			check: 6,
    			disabled: 7,
    			floating: 8,
    			inline: 9,
    			label: 0,
    			row: 10,
    			tag: 1
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.55.1 */

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[210] = list[i];
    	return child_ctx;
    }

    // (490:40) 
    function create_if_block_22(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[209], null);

    	let select_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ readonly: /*readonly*/ ctx[15] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	return {
    		c() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[6] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[207].call(select));
    		},
    		m(target, anchor) {
    			insert(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			(select_data.multiple ? select_options : select_option)(select, select_data.value);
    			if (select.autofocus) select.focus();
    			select_option(select, /*value*/ ctx[6]);
    			/*select_binding*/ ctx[208](select);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(select, "blur", /*blur_handler_20*/ ctx[156]),
    					listen(select, "change", /*change_handler_19*/ ctx[157]),
    					listen(select, "focus", /*focus_handler_20*/ ctx[158]),
    					listen(select, "input", /*input_handler_19*/ ctx[159]),
    					listen(select, "change", /*select_change_handler*/ ctx[207])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[6] & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[209],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[209])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[209], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				(!current || dirty[0] & /*classes*/ 262144) && { class: /*classes*/ ctx[18] },
    				(!current || dirty[0] & /*name*/ 8192) && { name: /*name*/ ctx[13] },
    				(!current || dirty[0] & /*disabled*/ 256) && { disabled: /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*readonly*/ 32768) && { readonly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*$$restProps, classes, name, disabled, readonly*/ 2400512 && 'value' in select_data) (select_data.multiple ? select_options : select_option)(select, select_data.value);

    			if (dirty[0] & /*value*/ 64) {
    				select_option(select, /*value*/ ctx[6]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(select);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding*/ ctx[208](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (472:29) 
    function create_if_block_21(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	return {
    		c() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			set_input_value(textarea, /*value*/ ctx[6]);
    			/*textarea_binding*/ ctx[206](textarea);

    			if (!mounted) {
    				dispose = [
    					listen(textarea, "blur", /*blur_handler_19*/ ctx[149]),
    					listen(textarea, "change", /*change_handler_18*/ ctx[150]),
    					listen(textarea, "focus", /*focus_handler_19*/ ctx[151]),
    					listen(textarea, "input", /*input_handler_18*/ ctx[152]),
    					listen(textarea, "keydown", /*keydown_handler_19*/ ctx[153]),
    					listen(textarea, "keypress", /*keypress_handler_19*/ ctx[154]),
    					listen(textarea, "keyup", /*keyup_handler_19*/ ctx[155]),
    					listen(textarea, "input", /*textarea_input_handler*/ ctx[205])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(textarea, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(textarea);
    			/*textarea_binding*/ ctx[206](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (93:0) {#if tag === 'input'}
    function create_if_block_2$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9,
    		create_if_block_10,
    		create_if_block_11,
    		create_if_block_12,
    		create_if_block_13,
    		create_if_block_14,
    		create_if_block_15,
    		create_if_block_16,
    		create_if_block_17,
    		create_if_block_18,
    		create_if_block_19,
    		create_if_block_20,
    		create_else_block_1
    	];

    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[16] === 'text') return 0;
    		if (/*type*/ ctx[16] === 'password') return 1;
    		if (/*type*/ ctx[16] === 'color') return 2;
    		if (/*type*/ ctx[16] === 'email') return 3;
    		if (/*type*/ ctx[16] === 'file') return 4;
    		if (/*type*/ ctx[16] === 'checkbox' || /*type*/ ctx[16] === 'radio' || /*type*/ ctx[16] === 'switch') return 5;
    		if (/*type*/ ctx[16] === 'url') return 6;
    		if (/*type*/ ctx[16] === 'number') return 7;
    		if (/*type*/ ctx[16] === 'date') return 8;
    		if (/*type*/ ctx[16] === 'time') return 9;
    		if (/*type*/ ctx[16] === 'datetime') return 10;
    		if (/*type*/ ctx[16] === 'datetime-local') return 11;
    		if (/*type*/ ctx[16] === 'month') return 12;
    		if (/*type*/ ctx[16] === 'color') return 13;
    		if (/*type*/ ctx[16] === 'range') return 14;
    		if (/*type*/ ctx[16] === 'search') return 15;
    		if (/*type*/ ctx[16] === 'tel') return 16;
    		if (/*type*/ ctx[16] === 'week') return 17;
    		return 18;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (453:2) {:else}
    function create_else_block_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: /*type*/ ctx[16] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ value: /*value*/ ctx[6] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_18*/ ctx[144]),
    					listen(input, "change", /*handleInput*/ ctx[20]),
    					listen(input, "focus", /*focus_handler_18*/ ctx[145]),
    					listen(input, "input", /*handleInput*/ ctx[20]),
    					listen(input, "keydown", /*keydown_handler_18*/ ctx[146]),
    					listen(input, "keypress", /*keypress_handler_18*/ ctx[147]),
    					listen(input, "keyup", /*keyup_handler_18*/ ctx[148])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*type*/ 65536 && { type: /*type*/ ctx[16] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6] && { value: /*value*/ ctx[6] }
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (434:28) 
    function create_if_block_20(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "week" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_16*/ ctx[204](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_17*/ ctx[137]),
    					listen(input, "change", /*change_handler_17*/ ctx[138]),
    					listen(input, "focus", /*focus_handler_17*/ ctx[139]),
    					listen(input, "input", /*input_handler_17*/ ctx[140]),
    					listen(input, "keydown", /*keydown_handler_17*/ ctx[141]),
    					listen(input, "keypress", /*keypress_handler_17*/ ctx[142]),
    					listen(input, "keyup", /*keyup_handler_17*/ ctx[143]),
    					listen(input, "input", /*input_input_handler_14*/ ctx[203])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "week" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_16*/ ctx[204](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (414:27) 
    function create_if_block_19(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "tel" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_15*/ ctx[202](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_16*/ ctx[130]),
    					listen(input, "change", /*change_handler_16*/ ctx[131]),
    					listen(input, "focus", /*focus_handler_16*/ ctx[132]),
    					listen(input, "input", /*input_handler_16*/ ctx[133]),
    					listen(input, "keydown", /*keydown_handler_16*/ ctx[134]),
    					listen(input, "keypress", /*keypress_handler_16*/ ctx[135]),
    					listen(input, "keyup", /*keyup_handler_16*/ ctx[136]),
    					listen(input, "input", /*input_input_handler_13*/ ctx[201])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "tel" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_15*/ ctx[202](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (394:30) 
    function create_if_block_18(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "search" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_14*/ ctx[200](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_15*/ ctx[123]),
    					listen(input, "change", /*change_handler_15*/ ctx[124]),
    					listen(input, "focus", /*focus_handler_15*/ ctx[125]),
    					listen(input, "input", /*input_handler_15*/ ctx[126]),
    					listen(input, "keydown", /*keydown_handler_15*/ ctx[127]),
    					listen(input, "keypress", /*keypress_handler_15*/ ctx[128]),
    					listen(input, "keyup", /*keyup_handler_15*/ ctx[129]),
    					listen(input, "input", /*input_input_handler_12*/ ctx[199])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "search" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_14*/ ctx[200](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (375:29) 
    function create_if_block_17(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_13*/ ctx[198](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_14*/ ctx[116]),
    					listen(input, "change", /*change_handler_14*/ ctx[117]),
    					listen(input, "focus", /*focus_handler_14*/ ctx[118]),
    					listen(input, "input", /*input_handler_14*/ ctx[119]),
    					listen(input, "keydown", /*keydown_handler_14*/ ctx[120]),
    					listen(input, "keypress", /*keypress_handler_14*/ ctx[121]),
    					listen(input, "keyup", /*keyup_handler_14*/ ctx[122]),
    					listen(input, "change", /*input_change_input_handler*/ ctx[197]),
    					listen(input, "input", /*input_change_input_handler*/ ctx[197])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_13*/ ctx[198](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (356:29) 
    function create_if_block_16(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_12*/ ctx[196](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_13*/ ctx[109]),
    					listen(input, "change", /*change_handler_13*/ ctx[110]),
    					listen(input, "focus", /*focus_handler_13*/ ctx[111]),
    					listen(input, "input", /*input_handler_13*/ ctx[112]),
    					listen(input, "keydown", /*keydown_handler_13*/ ctx[113]),
    					listen(input, "keypress", /*keypress_handler_13*/ ctx[114]),
    					listen(input, "keyup", /*keyup_handler_13*/ ctx[115]),
    					listen(input, "input", /*input_input_handler_11*/ ctx[195])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_12*/ ctx[196](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (337:29) 
    function create_if_block_15(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "month" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_11*/ ctx[194](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_12*/ ctx[102]),
    					listen(input, "change", /*change_handler_12*/ ctx[103]),
    					listen(input, "focus", /*focus_handler_12*/ ctx[104]),
    					listen(input, "input", /*input_handler_12*/ ctx[105]),
    					listen(input, "keydown", /*keydown_handler_12*/ ctx[106]),
    					listen(input, "keypress", /*keypress_handler_12*/ ctx[107]),
    					listen(input, "keyup", /*keyup_handler_12*/ ctx[108]),
    					listen(input, "input", /*input_input_handler_10*/ ctx[193])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "month" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_11*/ ctx[194](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (318:38) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "datetime-local" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_10*/ ctx[192](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_11*/ ctx[95]),
    					listen(input, "change", /*change_handler_11*/ ctx[96]),
    					listen(input, "focus", /*focus_handler_11*/ ctx[97]),
    					listen(input, "input", /*input_handler_11*/ ctx[98]),
    					listen(input, "keydown", /*keydown_handler_11*/ ctx[99]),
    					listen(input, "keypress", /*keypress_handler_11*/ ctx[100]),
    					listen(input, "keyup", /*keyup_handler_11*/ ctx[101]),
    					listen(input, "input", /*input_input_handler_9*/ ctx[191])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "datetime-local" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_10*/ ctx[192](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (299:32) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ class: /*classes*/ ctx[18] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_9*/ ctx[190](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_10*/ ctx[88]),
    					listen(input, "change", /*change_handler_10*/ ctx[89]),
    					listen(input, "focus", /*focus_handler_10*/ ctx[90]),
    					listen(input, "input", /*input_handler_10*/ ctx[91]),
    					listen(input, "keydown", /*keydown_handler_10*/ ctx[92]),
    					listen(input, "keypress", /*keypress_handler_10*/ ctx[93]),
    					listen(input, "keyup", /*keyup_handler_10*/ ctx[94]),
    					listen(input, "input", /*input_input_handler_8*/ ctx[189])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_9*/ ctx[190](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (280:28) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "time" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_8*/ ctx[188](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_9*/ ctx[81]),
    					listen(input, "change", /*change_handler_9*/ ctx[82]),
    					listen(input, "focus", /*focus_handler_9*/ ctx[83]),
    					listen(input, "input", /*input_handler_9*/ ctx[84]),
    					listen(input, "keydown", /*keydown_handler_9*/ ctx[85]),
    					listen(input, "keypress", /*keypress_handler_9*/ ctx[86]),
    					listen(input, "keyup", /*keyup_handler_9*/ ctx[87]),
    					listen(input, "input", /*input_input_handler_7*/ ctx[187])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "time" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_8*/ ctx[188](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (261:28) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "date" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_7*/ ctx[186](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_8*/ ctx[74]),
    					listen(input, "change", /*change_handler_8*/ ctx[75]),
    					listen(input, "focus", /*focus_handler_8*/ ctx[76]),
    					listen(input, "input", /*input_handler_8*/ ctx[77]),
    					listen(input, "keydown", /*keydown_handler_8*/ ctx[78]),
    					listen(input, "keypress", /*keypress_handler_8*/ ctx[79]),
    					listen(input, "keyup", /*keyup_handler_8*/ ctx[80]),
    					listen(input, "input", /*input_input_handler_6*/ ctx[185])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "date" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_7*/ ctx[186](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (242:30) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ name: /*name*/ ctx[13] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[14] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_6*/ ctx[184](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_7*/ ctx[67]),
    					listen(input, "change", /*change_handler_7*/ ctx[68]),
    					listen(input, "focus", /*focus_handler_7*/ ctx[69]),
    					listen(input, "input", /*input_handler_7*/ ctx[70]),
    					listen(input, "keydown", /*keydown_handler_7*/ ctx[71]),
    					listen(input, "keypress", /*keypress_handler_7*/ ctx[72]),
    					listen(input, "keyup", /*keyup_handler_7*/ ctx[73]),
    					listen(input, "input", /*input_input_handler_5*/ ctx[183])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] }
    			]));

    			if (dirty[0] & /*value*/ 64 && to_number(input.value) !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_6*/ ctx[184](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (222:27) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "url" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_5*/ ctx[182](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_6*/ ctx[60]),
    					listen(input, "change", /*change_handler_6*/ ctx[61]),
    					listen(input, "focus", /*focus_handler_6*/ ctx[62]),
    					listen(input, "input", /*input_handler_6*/ ctx[63]),
    					listen(input, "keydown", /*keydown_handler_6*/ ctx[64]),
    					listen(input, "keypress", /*keypress_handler_6*/ ctx[65]),
    					listen(input, "keyup", /*keyup_handler_6*/ ctx[66]),
    					listen(input, "input", /*input_input_handler_4*/ ctx[181])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "url" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_5*/ ctx[182](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (197:73) 
    function create_if_block_8(ctx) {
    	let formcheck;
    	let updating_checked;
    	let updating_inner;
    	let updating_group;
    	let updating_value;
    	let current;

    	const formcheck_spread_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*className*/ ctx[7] },
    		{ size: /*bsSize*/ ctx[0] },
    		{ type: /*type*/ ctx[16] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ invalid: /*invalid*/ ctx[10] },
    		{ label: /*label*/ ctx[11] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readonly: /*readonly*/ ctx[15] },
    		{ valid: /*valid*/ ctx[17] }
    	];

    	function formcheck_checked_binding(value) {
    		/*formcheck_checked_binding*/ ctx[170](value);
    	}

    	function formcheck_inner_binding(value) {
    		/*formcheck_inner_binding*/ ctx[171](value);
    	}

    	function formcheck_group_binding(value) {
    		/*formcheck_group_binding*/ ctx[172](value);
    	}

    	function formcheck_value_binding(value) {
    		/*formcheck_value_binding*/ ctx[173](value);
    	}

    	let formcheck_props = {};

    	for (let i = 0; i < formcheck_spread_levels.length; i += 1) {
    		formcheck_props = assign(formcheck_props, formcheck_spread_levels[i]);
    	}

    	if (/*checked*/ ctx[2] !== void 0) {
    		formcheck_props.checked = /*checked*/ ctx[2];
    	}

    	if (/*inner*/ ctx[5] !== void 0) {
    		formcheck_props.inner = /*inner*/ ctx[5];
    	}

    	if (/*group*/ ctx[4] !== void 0) {
    		formcheck_props.group = /*group*/ ctx[4];
    	}

    	if (/*value*/ ctx[6] !== void 0) {
    		formcheck_props.value = /*value*/ ctx[6];
    	}

    	formcheck = new FormCheck({ props: formcheck_props });
    	binding_callbacks.push(() => bind(formcheck, 'checked', formcheck_checked_binding));
    	binding_callbacks.push(() => bind(formcheck, 'inner', formcheck_inner_binding));
    	binding_callbacks.push(() => bind(formcheck, 'group', formcheck_group_binding));
    	binding_callbacks.push(() => bind(formcheck, 'value', formcheck_value_binding));
    	formcheck.$on("blur", /*blur_handler_5*/ ctx[174]);
    	formcheck.$on("change", /*change_handler_5*/ ctx[175]);
    	formcheck.$on("focus", /*focus_handler_5*/ ctx[176]);
    	formcheck.$on("input", /*input_handler_5*/ ctx[177]);
    	formcheck.$on("keydown", /*keydown_handler_5*/ ctx[178]);
    	formcheck.$on("keypress", /*keypress_handler_5*/ ctx[179]);
    	formcheck.$on("keyup", /*keyup_handler_5*/ ctx[180]);

    	return {
    		c() {
    			create_component(formcheck.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formcheck, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formcheck_changes = (dirty[0] & /*$$restProps, className, bsSize, type, disabled, invalid, label, name, placeholder, readonly, valid*/ 2354561)
    			? get_spread_update(formcheck_spread_levels, [
    					dirty[0] & /*$$restProps*/ 2097152 && get_spread_object(/*$$restProps*/ ctx[21]),
    					dirty[0] & /*className*/ 128 && { class: /*className*/ ctx[7] },
    					dirty[0] & /*bsSize*/ 1 && { size: /*bsSize*/ ctx[0] },
    					dirty[0] & /*type*/ 65536 && { type: /*type*/ ctx[16] },
    					dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    					dirty[0] & /*invalid*/ 1024 && { invalid: /*invalid*/ ctx[10] },
    					dirty[0] & /*label*/ 2048 && { label: /*label*/ ctx[11] },
    					dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    					dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    					dirty[0] & /*readonly*/ 32768 && { readonly: /*readonly*/ ctx[15] },
    					dirty[0] & /*valid*/ 131072 && { valid: /*valid*/ ctx[17] }
    				])
    			: {};

    			if (!updating_checked && dirty[0] & /*checked*/ 4) {
    				updating_checked = true;
    				formcheck_changes.checked = /*checked*/ ctx[2];
    				add_flush_callback(() => updating_checked = false);
    			}

    			if (!updating_inner && dirty[0] & /*inner*/ 32) {
    				updating_inner = true;
    				formcheck_changes.inner = /*inner*/ ctx[5];
    				add_flush_callback(() => updating_inner = false);
    			}

    			if (!updating_group && dirty[0] & /*group*/ 16) {
    				updating_group = true;
    				formcheck_changes.group = /*group*/ ctx[4];
    				add_flush_callback(() => updating_group = false);
    			}

    			if (!updating_value && dirty[0] & /*value*/ 64) {
    				updating_value = true;
    				formcheck_changes.value = /*value*/ ctx[6];
    				add_flush_callback(() => updating_value = false);
    			}

    			formcheck.$set(formcheck_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formcheck.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formcheck.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formcheck, detaching);
    		}
    	};
    }

    // (174:28) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "file" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ invalid: /*invalid*/ ctx[10] },
    		{ multiple: /*multiple*/ ctx[12] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ valid: /*valid*/ ctx[17] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding_4*/ ctx[169](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_4*/ ctx[53]),
    					listen(input, "change", /*change_handler_4*/ ctx[54]),
    					listen(input, "focus", /*focus_handler_4*/ ctx[55]),
    					listen(input, "input", /*input_handler_4*/ ctx[56]),
    					listen(input, "keydown", /*keydown_handler_4*/ ctx[57]),
    					listen(input, "keypress", /*keypress_handler_4*/ ctx[58]),
    					listen(input, "keyup", /*keyup_handler_4*/ ctx[59]),
    					listen(input, "change", /*input_change_handler*/ ctx[168])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "file" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*invalid*/ 1024 && { invalid: /*invalid*/ ctx[10] },
    				dirty[0] & /*multiple*/ 4096 && { multiple: /*multiple*/ ctx[12] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*valid*/ 131072 && { valid: /*valid*/ ctx[17] }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_4*/ ctx[169](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (153:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "email" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ multiple: /*multiple*/ ctx[12] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_3*/ ctx[167](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_3*/ ctx[46]),
    					listen(input, "change", /*change_handler_3*/ ctx[47]),
    					listen(input, "focus", /*focus_handler_3*/ ctx[48]),
    					listen(input, "input", /*input_handler_3*/ ctx[49]),
    					listen(input, "keydown", /*keydown_handler_3*/ ctx[50]),
    					listen(input, "keypress", /*keypress_handler_3*/ ctx[51]),
    					listen(input, "keyup", /*keyup_handler_3*/ ctx[52]),
    					listen(input, "input", /*input_input_handler_3*/ ctx[166])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "email" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*multiple*/ 4096 && { multiple: /*multiple*/ ctx[12] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_3*/ ctx[167](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (134:29) 
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "color" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_2*/ ctx[165](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_2*/ ctx[39]),
    					listen(input, "change", /*change_handler_2*/ ctx[40]),
    					listen(input, "focus", /*focus_handler_2*/ ctx[41]),
    					listen(input, "input", /*input_handler_2*/ ctx[42]),
    					listen(input, "keydown", /*keydown_handler_2*/ ctx[43]),
    					listen(input, "keypress", /*keypress_handler_2*/ ctx[44]),
    					listen(input, "keyup", /*keyup_handler_2*/ ctx[45]),
    					listen(input, "input", /*input_input_handler_2*/ ctx[164])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "color" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] }
    			]));

    			if (dirty[0] & /*value*/ 64) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_2*/ ctx[165](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (114:32) 
    function create_if_block_4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "password" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding_1*/ ctx[163](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_1*/ ctx[32]),
    					listen(input, "change", /*change_handler_1*/ ctx[33]),
    					listen(input, "focus", /*focus_handler_1*/ ctx[34]),
    					listen(input, "input", /*input_handler_1*/ ctx[35]),
    					listen(input, "keydown", /*keydown_handler_1*/ ctx[36]),
    					listen(input, "keypress", /*keypress_handler_1*/ ctx[37]),
    					listen(input, "keyup", /*keyup_handler_1*/ ctx[38]),
    					listen(input, "input", /*input_input_handler_1*/ ctx[162])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "password" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding_1*/ ctx[163](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (94:2) {#if type === 'text'}
    function create_if_block_3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[21],
    		{ class: /*classes*/ ctx[18] },
    		{ type: "text" },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ name: /*name*/ ctx[13] },
    		{ placeholder: /*placeholder*/ ctx[14] },
    		{ readOnly: /*readonly*/ ctx[15] },
    		{ size: /*size*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[6]);
    			/*input_binding*/ ctx[161](input);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler*/ ctx[25]),
    					listen(input, "change", /*change_handler*/ ctx[26]),
    					listen(input, "focus", /*focus_handler*/ ctx[27]),
    					listen(input, "input", /*input_handler*/ ctx[28]),
    					listen(input, "keydown", /*keydown_handler*/ ctx[29]),
    					listen(input, "keypress", /*keypress_handler*/ ctx[30]),
    					listen(input, "keyup", /*keyup_handler*/ ctx[31]),
    					listen(input, "input", /*input_input_handler*/ ctx[160])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				dirty[0] & /*classes*/ 262144 && { class: /*classes*/ ctx[18] },
    				{ type: "text" },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*name*/ 8192 && { name: /*name*/ ctx[13] },
    				dirty[0] & /*placeholder*/ 16384 && { placeholder: /*placeholder*/ ctx[14] },
    				dirty[0] & /*readonly*/ 32768 && { readOnly: /*readonly*/ ctx[15] },
    				dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] }
    			]));

    			if (dirty[0] & /*value*/ 64 && input.value !== /*value*/ ctx[6]) {
    				set_input_value(input, /*value*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(input);
    			/*input_binding*/ ctx[161](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (523:0) {#if feedback}
    function create_if_block$5(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (dirty[0] & /*feedback*/ 512) show_if = null;
    		if (show_if == null) show_if = !!Array.isArray(/*feedback*/ ctx[9]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx, [-1, -1, -1, -1, -1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (528:2) {:else}
    function create_else_block$5(ctx) {
    	let formfeedback;
    	let current;

    	formfeedback = new FormFeedback({
    			props: {
    				valid: /*valid*/ ctx[17],
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formfeedback.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formfeedback, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formfeedback_changes = {};
    			if (dirty[0] & /*valid*/ 131072) formfeedback_changes.valid = /*valid*/ ctx[17];

    			if (dirty[0] & /*feedback*/ 512 | dirty[6] & /*$$scope*/ 8388608) {
    				formfeedback_changes.$$scope = { dirty, ctx };
    			}

    			formfeedback.$set(formfeedback_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formfeedback.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formfeedback.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formfeedback, detaching);
    		}
    	};
    }

    // (524:2) {#if Array.isArray(feedback)}
    function create_if_block_1$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*feedback*/ ctx[9];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*valid, feedback*/ 131584) {
    				each_value = /*feedback*/ ctx[9];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (529:4) <FormFeedback {valid}>
    function create_default_slot_1$6(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*feedback*/ ctx[9]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*feedback*/ 512) set_data(t, /*feedback*/ ctx[9]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (526:6) <FormFeedback {valid}>
    function create_default_slot$9(ctx) {
    	let t_value = /*msg*/ ctx[210] + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*feedback*/ 512 && t_value !== (t_value = /*msg*/ ctx[210] + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (525:4) {#each feedback as msg}
    function create_each_block$2(ctx) {
    	let formfeedback;
    	let current;

    	formfeedback = new FormFeedback({
    			props: {
    				valid: /*valid*/ ctx[17],
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formfeedback.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formfeedback, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formfeedback_changes = {};
    			if (dirty[0] & /*valid*/ 131072) formfeedback_changes.valid = /*valid*/ ctx[17];

    			if (dirty[0] & /*feedback*/ 512 | dirty[6] & /*$$scope*/ 8388608) {
    				formfeedback_changes.$$scope = { dirty, ctx };
    			}

    			formfeedback.$set(formfeedback_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formfeedback.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formfeedback.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formfeedback, detaching);
    		}
    	};
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_if_block_21, create_if_block_22];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[19] === 'input') return 0;
    		if (/*tag*/ ctx[19] === 'textarea') return 1;
    		if (/*tag*/ ctx[19] === 'select' && !/*multiple*/ ctx[12]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block1 = /*feedback*/ ctx[9] && create_if_block$5(ctx);

    	return {
    		c() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (/*feedback*/ ctx[9]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*feedback*/ 512) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach(if_block1_anchor);
    		}
    	};
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","bsSize","checked","color","disabled","feedback","files","group","inner","invalid","label","multiple","name","placeholder","plaintext","readonly","size","type","valid","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { color = undefined } = $$props;
    	let { disabled = undefined } = $$props;
    	let { feedback = undefined } = $$props;
    	let { files = undefined } = $$props;
    	let { group = undefined } = $$props;
    	let { inner = undefined } = $$props;
    	let { invalid = false } = $$props;
    	let { label = undefined } = $$props;
    	let { multiple = undefined } = $$props;
    	let { name = '' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { plaintext = false } = $$props;
    	let { readonly = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { type = 'text' } = $$props;
    	let { valid = false } = $$props;
    	let { value = '' } = $$props;
    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(6, value = event.target.value);
    	};

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_17(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_18(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_20(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_20(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_19(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_3($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_change_handler() {
    		files = this.files;
    		value = this.value;
    		$$invalidate(3, files);
    		$$invalidate(6, value);
    	}

    	function input_binding_4($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function formcheck_checked_binding(value) {
    		checked = value;
    		$$invalidate(2, checked);
    	}

    	function formcheck_inner_binding(value) {
    		inner = value;
    		$$invalidate(5, inner);
    	}

    	function formcheck_group_binding(value) {
    		group = value;
    		$$invalidate(4, group);
    	}

    	function formcheck_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(6, value);
    	}

    	function blur_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler_4() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_5($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_5() {
    		value = to_number(this.value);
    		$$invalidate(6, value);
    	}

    	function input_binding_6($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_7($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_8($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_9($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_10($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_10() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_11($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_11() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_12($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(6, value);
    	}

    	function input_binding_13($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_12() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_14($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_13() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_15($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function input_input_handler_14() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function input_binding_16($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(6, value);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(6, value);
    	}

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(5, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(21, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ('bsSize' in $$new_props) $$invalidate(0, bsSize = $$new_props.bsSize);
    		if ('checked' in $$new_props) $$invalidate(2, checked = $$new_props.checked);
    		if ('color' in $$new_props) $$invalidate(22, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('feedback' in $$new_props) $$invalidate(9, feedback = $$new_props.feedback);
    		if ('files' in $$new_props) $$invalidate(3, files = $$new_props.files);
    		if ('group' in $$new_props) $$invalidate(4, group = $$new_props.group);
    		if ('inner' in $$new_props) $$invalidate(5, inner = $$new_props.inner);
    		if ('invalid' in $$new_props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ('label' in $$new_props) $$invalidate(11, label = $$new_props.label);
    		if ('multiple' in $$new_props) $$invalidate(12, multiple = $$new_props.multiple);
    		if ('name' in $$new_props) $$invalidate(13, name = $$new_props.name);
    		if ('placeholder' in $$new_props) $$invalidate(14, placeholder = $$new_props.placeholder);
    		if ('plaintext' in $$new_props) $$invalidate(23, plaintext = $$new_props.plaintext);
    		if ('readonly' in $$new_props) $$invalidate(15, readonly = $$new_props.readonly);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('type' in $$new_props) $$invalidate(16, type = $$new_props.type);
    		if ('valid' in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ('value' in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ('$$scope' in $$new_props) $$invalidate(209, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, color, plaintext, size, className, invalid, valid, bsSize*/ 12780675) {
    			{
    				const isNotaNumber = new RegExp('\\D', 'g');
    				let isBtn = false;
    				let formControlClass = 'form-control';
    				$$invalidate(19, tag = 'input');

    				switch (type) {
    					case 'color':
    						formControlClass = `form-control form-control-color`;
    						break;
    					case 'range':
    						formControlClass = 'form-range';
    						break;
    					case 'select':
    						formControlClass = `form-select`;
    						$$invalidate(19, tag = 'select');
    						break;
    					case 'textarea':
    						$$invalidate(19, tag = 'textarea');
    						break;
    					case 'button':
    					case 'reset':
    					case 'submit':
    						formControlClass = `btn btn-${color || 'secondary'}`;
    						isBtn = true;
    						break;
    					case 'hidden':
    					case 'image':
    						formControlClass = undefined;
    						break;
    					default:
    						formControlClass = 'form-control';
    						$$invalidate(19, tag = 'input');
    				}

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(19, tag = 'input');
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
    					$$invalidate(0, bsSize = size);
    					$$invalidate(1, size = undefined);
    				}

    				$$invalidate(18, classes = classnames(className, formControlClass, {
    					'is-invalid': invalid,
    					'is-valid': valid,
    					[`form-control-${bsSize}`]: bsSize && !isBtn,
    					[`btn-${bsSize}`]: bsSize && isBtn
    				}));
    			}
    		}
    	};

    	return [
    		bsSize,
    		size,
    		checked,
    		files,
    		group,
    		inner,
    		value,
    		className,
    		disabled,
    		feedback,
    		invalid,
    		label,
    		multiple,
    		name,
    		placeholder,
    		readonly,
    		type,
    		valid,
    		classes,
    		tag,
    		handleInput,
    		$$restProps,
    		color,
    		plaintext,
    		slots,
    		blur_handler,
    		change_handler,
    		focus_handler,
    		input_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		blur_handler_1,
    		change_handler_1,
    		focus_handler_1,
    		input_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		blur_handler_2,
    		change_handler_2,
    		focus_handler_2,
    		input_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		blur_handler_3,
    		change_handler_3,
    		focus_handler_3,
    		input_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		blur_handler_4,
    		change_handler_4,
    		focus_handler_4,
    		input_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		blur_handler_6,
    		change_handler_6,
    		focus_handler_6,
    		input_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		blur_handler_7,
    		change_handler_7,
    		focus_handler_7,
    		input_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		blur_handler_8,
    		change_handler_8,
    		focus_handler_8,
    		input_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		blur_handler_9,
    		change_handler_9,
    		focus_handler_9,
    		input_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		blur_handler_10,
    		change_handler_10,
    		focus_handler_10,
    		input_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		blur_handler_11,
    		change_handler_11,
    		focus_handler_11,
    		input_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		blur_handler_12,
    		change_handler_12,
    		focus_handler_12,
    		input_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		blur_handler_13,
    		change_handler_13,
    		focus_handler_13,
    		input_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		blur_handler_14,
    		change_handler_14,
    		focus_handler_14,
    		input_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		change_handler_15,
    		focus_handler_15,
    		input_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		blur_handler_16,
    		change_handler_16,
    		focus_handler_16,
    		input_handler_16,
    		keydown_handler_16,
    		keypress_handler_16,
    		keyup_handler_16,
    		blur_handler_17,
    		change_handler_17,
    		focus_handler_17,
    		input_handler_17,
    		keydown_handler_17,
    		keypress_handler_17,
    		keyup_handler_17,
    		blur_handler_18,
    		focus_handler_18,
    		keydown_handler_18,
    		keypress_handler_18,
    		keyup_handler_18,
    		blur_handler_19,
    		change_handler_18,
    		focus_handler_19,
    		input_handler_18,
    		keydown_handler_19,
    		keypress_handler_19,
    		keyup_handler_19,
    		blur_handler_20,
    		change_handler_19,
    		focus_handler_20,
    		input_handler_19,
    		input_input_handler,
    		input_binding,
    		input_input_handler_1,
    		input_binding_1,
    		input_input_handler_2,
    		input_binding_2,
    		input_input_handler_3,
    		input_binding_3,
    		input_change_handler,
    		input_binding_4,
    		formcheck_checked_binding,
    		formcheck_inner_binding,
    		formcheck_group_binding,
    		formcheck_value_binding,
    		blur_handler_5,
    		change_handler_5,
    		focus_handler_5,
    		input_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		input_input_handler_4,
    		input_binding_5,
    		input_input_handler_5,
    		input_binding_6,
    		input_input_handler_6,
    		input_binding_7,
    		input_input_handler_7,
    		input_binding_8,
    		input_input_handler_8,
    		input_binding_9,
    		input_input_handler_9,
    		input_binding_10,
    		input_input_handler_10,
    		input_binding_11,
    		input_input_handler_11,
    		input_binding_12,
    		input_change_input_handler,
    		input_binding_13,
    		input_input_handler_12,
    		input_binding_14,
    		input_input_handler_13,
    		input_binding_15,
    		input_input_handler_14,
    		input_binding_16,
    		textarea_input_handler,
    		textarea_binding,
    		select_change_handler,
    		select_binding,
    		$$scope
    	];
    }

    class Input extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$h,
    			safe_not_equal,
    			{
    				class: 7,
    				bsSize: 0,
    				checked: 2,
    				color: 22,
    				disabled: 8,
    				feedback: 9,
    				files: 3,
    				group: 4,
    				inner: 5,
    				invalid: 10,
    				label: 11,
    				multiple: 12,
    				name: 13,
    				placeholder: 14,
    				plaintext: 23,
    				readonly: 15,
    				size: 1,
    				type: 16,
    				valid: 17,
    				value: 6
    			},
    			null,
    			[-1, -1, -1, -1, -1, -1, -1]
    		);
    	}
    }

    /* node_modules\sveltestrap\src\InputGroup.svelte generated by Svelte v3.55.1 */

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { size = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('size' in $$new_props) $$invalidate(3, size = $$new_props.size);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size*/ 12) {
    			$$invalidate(0, classes = classnames(className, 'input-group', size ? `input-group-${size}` : null));
    		}
    	};

    	return [classes, $$restProps, className, size, $$scope, slots];
    }

    class InputGroup extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$f, create_fragment$g, safe_not_equal, { class: 2, size: 3 });
    	}
    }

    /* node_modules\sveltestrap\src\Label.svelte generated by Svelte v3.55.1 */

    function create_fragment$f(ctx) {
    	let label;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let label_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ for: /*fore*/ ctx[0] }
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	return {
    		c() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*fore*/ 1) && { for: /*fore*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","hidden","check","size","for","xs","sm","md","lg","xl","xxl","widths"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { hidden = false } = $$props;
    	let { check = false } = $$props;
    	let { size = '' } = $$props;
    	let { for: fore = null } = $$props;
    	let { xs = '' } = $$props;
    	let { sm = '' } = $$props;
    	let { md = '' } = $$props;
    	let { lg = '' } = $$props;
    	let { xl = '' } = $$props;
    	let { xxl = '' } = $$props;
    	const colWidths = { xs, sm, md, lg, xl, xxl };
    	let { widths = Object.keys(colWidths) } = $$props;
    	const colClasses = [];

    	widths.forEach(colWidth => {
    		let columnProp = $$props[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return;
    		}

    		const isXs = colWidth === 'xs';
    		let colClass;

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			colClasses.push(classnames({
    				[colClass]: columnProp.size || columnProp.size === '',
    				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
    				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
    			}));
    		} else {
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
    			colClasses.push(colClass);
    		}
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('hidden' in $$new_props) $$invalidate(4, hidden = $$new_props.hidden);
    		if ('check' in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ('size' in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ('for' in $$new_props) $$invalidate(0, fore = $$new_props.for);
    		if ('xs' in $$new_props) $$invalidate(7, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(8, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(9, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(10, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(11, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(12, xxl = $$new_props.xxl);
    		if ('widths' in $$new_props) $$invalidate(13, widths = $$new_props.widths);
    		if ('$$scope' in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, hidden, check, size*/ 120) {
    			$$invalidate(1, classes = classnames(className, hidden ? 'visually-hidden' : false, check ? 'form-check-label' : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? 'col-form-label' : 'form-label'));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		fore,
    		classes,
    		$$restProps,
    		className,
    		hidden,
    		check,
    		size,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		widths,
    		$$scope,
    		slots
    	];
    }

    class Label extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$e, create_fragment$f, safe_not_equal, {
    			class: 3,
    			hidden: 4,
    			check: 5,
    			size: 6,
    			for: 0,
    			xs: 7,
    			sm: 8,
    			md: 9,
    			lg: 10,
    			xl: 11,
    			xxl: 12,
    			widths: 13
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ListGroup.svelte generated by Svelte v3.55.1 */

    function create_else_block$4(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let ul_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	return {
    		c() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (15:0) {#if numbered}
    function create_if_block$4(ctx) {
    	let ol;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let ol_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let ol_data = {};

    	for (let i = 0; i < ol_levels.length; i += 1) {
    		ol_data = assign(ol_data, ol_levels[i]);
    	}

    	return {
    		c() {
    			ol = element("ol");
    			if (default_slot) default_slot.c();
    			set_attributes(ol, ol_data);
    		},
    		m(target, anchor) {
    			insert(target, ol, anchor);

    			if (default_slot) {
    				default_slot.m(ol, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ol, ol_data = get_spread_update(ol_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ol);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*numbered*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","flush","numbered"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { flush = false } = $$props;
    	let { numbered = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('flush' in $$new_props) $$invalidate(4, flush = $$new_props.flush);
    		if ('numbered' in $$new_props) $$invalidate(0, numbered = $$new_props.numbered);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, flush, numbered*/ 25) {
    			$$invalidate(1, classes = classnames(className, 'list-group', {
    				'list-group-flush': flush,
    				'list-group-numbered': numbered
    			}));
    		}
    	};

    	return [numbered, classes, $$restProps, className, flush, $$scope, slots];
    }

    class ListGroup extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$d, create_fragment$e, safe_not_equal, { class: 3, flush: 4, numbered: 0 });
    	}
    }

    /* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.55.1 */

    function create_fragment$d(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	return {
    		c() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === 'xs') {
    		return 'flex-column';
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = '' } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('tabs' in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? 'navbar-nav' : 'nav', horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				'nav-tabs': tabs,
    				'card-header-tabs': card && tabs,
    				'nav-pills': pills,
    				'card-header-pills': card && pills,
    				'nav-justified': justified,
    				'nav-fill': fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$c, create_fragment$d, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Navbar.svelte generated by Svelte v3.55.1 */

    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (40:2) {#if container}
    function create_if_block$3(ctx) {
    	let container_1;
    	let current;

    	container_1 = new Container({
    			props: {
    				fluid: /*container*/ ctx[0] === 'fluid',
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(container_1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(container_1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const container_1_changes = {};
    			if (dirty & /*container*/ 1) container_1_changes.fluid = /*container*/ ctx[0] === 'fluid';

    			if (dirty & /*$$scope*/ 2048) {
    				container_1_changes.$$scope = { dirty, ctx };
    			}

    			container_1.$set(container_1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(container_1, detaching);
    		}
    	};
    }

    // (41:4) <Container fluid={container === 'fluid'}>
    function create_default_slot$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$c(ctx) {
    	let nav;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*container*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let nav_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	return {
    		c() {
    			nav = element("nav");
    			if_block.c();
    			set_attributes(nav, nav_data);
    		},
    		m(target, anchor) {
    			insert(target, nav, anchor);
    			if_blocks[current_block_type_index].m(nav, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(nav, null);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(nav);
    			if_blocks[current_block_type_index].d();
    		}
    	};
    }

    function getExpandClass(expand) {
    	if (expand === false) {
    		return false;
    	} else if (expand === true || expand === 'xs') {
    		return 'navbar-expand';
    	}

    	return `navbar-expand-${expand}`;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","container","color","dark","expand","fixed","light","sticky"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	setContext('navbar', { inNavbar: true });
    	let { class: className = '' } = $$props;
    	let { container = 'fluid' } = $$props;
    	let { color = '' } = $$props;
    	let { dark = false } = $$props;
    	let { expand = '' } = $$props;
    	let { fixed = '' } = $$props;
    	let { light = false } = $$props;
    	let { sticky = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('container' in $$new_props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('dark' in $$new_props) $$invalidate(5, dark = $$new_props.dark);
    		if ('expand' in $$new_props) $$invalidate(6, expand = $$new_props.expand);
    		if ('fixed' in $$new_props) $$invalidate(7, fixed = $$new_props.fixed);
    		if ('light' in $$new_props) $$invalidate(8, light = $$new_props.light);
    		if ('sticky' in $$new_props) $$invalidate(9, sticky = $$new_props.sticky);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, expand, light, dark, color, fixed, sticky*/ 1016) {
    			$$invalidate(1, classes = classnames(className, 'navbar', getExpandClass(expand), {
    				'navbar-light': light,
    				'navbar-dark': dark,
    				[`bg-${color}`]: color,
    				[`fixed-${fixed}`]: fixed,
    				[`sticky-${sticky}`]: sticky
    			}));
    		}
    	};

    	return [
    		container,
    		classes,
    		$$restProps,
    		className,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		slots,
    		$$scope
    	];
    }

    class Navbar extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$b, create_fragment$c, safe_not_equal, {
    			class: 3,
    			container: 0,
    			color: 4,
    			dark: 5,
    			expand: 6,
    			fixed: 7,
    			light: 8,
    			sticky: 9
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Row.svelte generated by Svelte v3.55.1 */

    function create_fragment$b(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[9](null);
    		}
    	};
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols","inner"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;
    	let { inner = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(4, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(5, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(6, cols = $$new_props.cols);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 120) {
    			$$invalidate(1, classes = classnames(className, noGutters ? 'gx-0' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [
    		inner,
    		classes,
    		$$restProps,
    		className,
    		noGutters,
    		form,
    		cols,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Row extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$a, create_fragment$b, safe_not_equal, {
    			class: 3,
    			noGutters: 4,
    			form: 5,
    			cols: 6,
    			inner: 0
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ToastBody.svelte generated by Svelte v3.55.1 */

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'toast-body'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ToastBody extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$9, create_fragment$a, safe_not_equal, { class: 2 });
    	}
    }

    /* node_modules\sveltestrap\src\ToastHeader.svelte generated by Svelte v3.55.1 */
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (29:2) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[8].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[7], get_icon_slot_context);

    	return {
    		c() {
    			if (icon_slot) icon_slot.c();
    		},
    		m(target, anchor) {
    			if (icon_slot) {
    				icon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[7], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(icon_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (icon_slot) icon_slot.d(detaching);
    		}
    	};
    }

    // (17:2) {#if icon}
    function create_if_block_1$2(ctx) {
    	let svg;
    	let rect;
    	let svg_class_value;

    	return {
    		c() {
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			attr(rect, "fill", "currentColor");
    			attr(rect, "width", "100%");
    			attr(rect, "height", "100%");
    			attr(svg, "class", svg_class_value = `rounded text-${/*icon*/ ctx[0]}`);
    			attr(svg, "width", "20");
    			attr(svg, "height", "20");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "preserveAspectRatio", "xMidYMid slice");
    			attr(svg, "focusable", "false");
    			attr(svg, "role", "img");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, rect);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*icon*/ 1 && svg_class_value !== (svg_class_value = `rounded text-${/*icon*/ ctx[0]}`)) {
    				attr(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    // (35:2) {#if toggle}
    function create_if_block$2(ctx) {
    	let current;
    	const close_slot_template = /*#slots*/ ctx[8].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[7], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block(ctx);

    	return {
    		c() {
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    		},
    		m(target, anchor) {
    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (close_slot) {
    				if (close_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						close_slot,
    						close_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(close_slot_template, /*$$scope*/ ctx[7], dirty, get_close_slot_changes),
    						get_close_slot_context
    					);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && (!current || dirty & /*closeAriaLabel, toggle*/ 6)) {
    					close_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};
    }

    // (36:23)        
    function fallback_block(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				close: true,
    				"aria-label": /*closeAriaLabel*/ ctx[2]
    			}
    		});

    	button.$on("click", function () {
    		if (is_function(/*toggle*/ ctx[1])) /*toggle*/ ctx[1].apply(this, arguments);
    	});

    	return {
    		c() {
    			create_component(button.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};
    			if (dirty & /*closeAriaLabel*/ 4) button_changes["aria-label"] = /*closeAriaLabel*/ ctx[2];
    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(button, detaching);
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let strong;
    	let t1;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*icon*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let if_block1 = /*toggle*/ ctx[1] && create_if_block$2(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[4] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if_block0.c();
    			t0 = space();
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr(strong, "class", /*tagClassName*/ ctx[3]);
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			append(div, t0);
    			append(div, strong);

    			if (default_slot) {
    				default_slot.m(strong, null);
    			}

    			append(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t0);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*tagClassName*/ 8) {
    				attr(strong, "class", /*tagClassName*/ ctx[3]);
    			}

    			if (/*toggle*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*toggle*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if_blocks[current_block_type_index].d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block1) if_block1.d();
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let classes;
    	let tagClassName;
    	const omit_props_names = ["class","icon","toggle","closeAriaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { icon = null } = $$props;
    	let { toggle = null } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ('icon' in $$new_props) $$invalidate(0, icon = $$new_props.icon);
    		if ('toggle' in $$new_props) $$invalidate(1, toggle = $$new_props.toggle);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(4, classes = classnames(className, 'toast-header'));
    		}

    		if ($$self.$$.dirty & /*icon*/ 1) {
    			$$invalidate(3, tagClassName = classnames('me-auto', { 'ms-2': icon != null }));
    		}
    	};

    	return [
    		icon,
    		toggle,
    		closeAriaLabel,
    		tagClassName,
    		classes,
    		$$restProps,
    		className,
    		$$scope,
    		slots
    	];
    }

    class ToastHeader extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$8, create_fragment$9, safe_not_equal, {
    			class: 6,
    			icon: 0,
    			toggle: 1,
    			closeAriaLabel: 2
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Toast.svelte generated by Svelte v3.55.1 */

    function create_if_block$1(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*header*/ ctx[4] && create_if_block_2$1(ctx);
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*body*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[8], { class: /*classes*/ ctx[6] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(div, "introstart", /*introstart_handler*/ ctx[13]),
    					listen(div, "introend", /*introend_handler*/ ctx[14]),
    					listen(div, "outrostart", /*outrostart_handler*/ ctx[15]),
    					listen(div, "outroend", /*outroend_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*header*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*header*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8],
    				(!current || dirty & /*classes*/ 64) && { class: /*classes*/ ctx[6] },
    				{ role: "alert" }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(
    					div,
    					fade,
    					{
    						duration: /*fade*/ ctx[3] && /*duration*/ ctx[2]
    					},
    					true
    				);

    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);

    			if (!div_transition) div_transition = create_bidirectional_transition(
    				div,
    				fade,
    				{
    					duration: /*fade*/ ctx[3] && /*duration*/ ctx[2]
    				},
    				false
    			);

    			div_transition.run(0);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (47:4) {#if header}
    function create_if_block_2$1(ctx) {
    	let toastheader;
    	let current;

    	toastheader = new ToastHeader({
    			props: {
    				toggle: /*toggle*/ ctx[5],
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(toastheader.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(toastheader, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const toastheader_changes = {};
    			if (dirty & /*toggle*/ 32) toastheader_changes.toggle = /*toggle*/ ctx[5];

    			if (dirty & /*$$scope, header*/ 131088) {
    				toastheader_changes.$$scope = { dirty, ctx };
    			}

    			toastheader.$set(toastheader_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(toastheader.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(toastheader.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(toastheader, detaching);
    		}
    	};
    }

    // (48:6) <ToastHeader {toggle}>
    function create_default_slot_1$5(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*header*/ ctx[4]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*header*/ 16) set_data(t, /*header*/ ctx[4]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (56:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (52:4) {#if body}
    function create_if_block_1$1(ctx) {
    	let toastbody;
    	let current;

    	toastbody = new ToastBody({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(toastbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(toastbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const toastbody_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				toastbody_changes.$$scope = { dirty, ctx };
    			}

    			toastbody.$set(toastbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(toastbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(toastbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(toastbody, detaching);
    		}
    	};
    }

    // (53:6) <ToastBody>
    function create_default_slot$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","autohide","body","delay","duration","fade","header","isOpen","toggle"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher();
    	let { class: className = '' } = $$props;
    	let { autohide = false } = $$props;
    	let { body = false } = $$props;
    	let { delay = 5000 } = $$props;
    	let { duration = 200 } = $$props;
    	let { fade = true } = $$props;
    	let { header = undefined } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = null } = $$props;
    	let timeout;

    	onDestroy(() => {
    		return () => clearTimeout(timeout);
    	});

    	const introstart_handler = () => dispatch('opening');
    	const introend_handler = () => dispatch('open');
    	const outrostart_handler = () => dispatch('closing');
    	const outroend_handler = () => dispatch('close');

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ('autohide' in $$new_props) $$invalidate(10, autohide = $$new_props.autohide);
    		if ('body' in $$new_props) $$invalidate(1, body = $$new_props.body);
    		if ('delay' in $$new_props) $$invalidate(11, delay = $$new_props.delay);
    		if ('duration' in $$new_props) $$invalidate(2, duration = $$new_props.duration);
    		if ('fade' in $$new_props) $$invalidate(3, fade = $$new_props.fade);
    		if ('header' in $$new_props) $$invalidate(4, header = $$new_props.header);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$new_props) $$invalidate(5, toggle = $$new_props.toggle);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpen, autohide, delay*/ 3073) {
    			if (isOpen && autohide) {
    				timeout = setTimeout(() => $$invalidate(0, isOpen = false), delay);
    			}
    		}

    		if ($$self.$$.dirty & /*className, isOpen*/ 513) {
    			$$invalidate(6, classes = classnames(className, 'toast', { show: isOpen }));
    		}
    	};

    	return [
    		isOpen,
    		body,
    		duration,
    		fade,
    		header,
    		toggle,
    		classes,
    		dispatch,
    		$$restProps,
    		className,
    		autohide,
    		delay,
    		slots,
    		introstart_handler,
    		introend_handler,
    		outrostart_handler,
    		outroend_handler,
    		$$scope
    	];
    }

    class Toast extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$7, create_fragment$8, safe_not_equal, {
    			class: 9,
    			autohide: 10,
    			body: 1,
    			delay: 11,
    			duration: 2,
    			fade: 3,
    			header: 4,
    			isOpen: 0,
    			toggle: 5
    		});
    	}
    }

    /* src\client\pages\KYC.svelte generated by Svelte v3.55.1 */

    function create_default_slot_43(ctx) {
    	let h3;

    	return {
    		c() {
    			h3 = element("h3");
    			h3.textContent = "Onboarding";
    		},
    		m(target, anchor) {
    			insert(target, h3, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(h3);
    		}
    	};
    }

    // (53:6) <Label for="name">
    function create_default_slot_42(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Full Name");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (54:6) <FormGroup>
    function create_default_slot_41(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				placeholder: "Full Name",
    				required: true
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (62:6) <Label for="name">
    function create_default_slot_40(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Gender");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (64:8) <Input type="text" name="datasource_id" required placeholder="Gender">
    function create_default_slot_39(ctx) {
    	let option0;
    	let t1;
    	let option1;
    	let t3;
    	let option2;

    	return {
    		c() {
    			option0 = element("option");
    			option0.textContent = "M";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "F";
    			t3 = space();
    			option2 = element("option");
    			option2.textContent = "O";
    			option0.__value = "M";
    			option0.value = option0.__value;
    			option1.__value = "F";
    			option1.value = option1.__value;
    			option2.__value = "O";
    			option2.value = option2.__value;
    		},
    		m(target, anchor) {
    			insert(target, option0, anchor);
    			insert(target, t1, anchor);
    			insert(target, option1, anchor);
    			insert(target, t3, anchor);
    			insert(target, option2, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(option0);
    			if (detaching) detach(t1);
    			if (detaching) detach(option1);
    			if (detaching) detach(t3);
    			if (detaching) detach(option2);
    		}
    	};
    }

    // (63:6) <FormGroup>
    function create_default_slot_38(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Gender",
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const input_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			input.$set(input_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (70:6) <Label for="name">
    function create_default_slot_37(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Mobile Number");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (71:6) <FormGroup>
    function create_default_slot_36(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Mobile Number"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (79:6) <Label for="name">
    function create_default_slot_35(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Email");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (80:6) <FormGroup>
    function create_default_slot_34(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Email"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (83:6) <Label for="name">
    function create_default_slot_33(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("DOB");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (84:6) <FormGroup>
    function create_default_slot_32(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "date",
    				name: "datasource_id",
    				placeholder: "DOB"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (87:6) <Label for="name">
    function create_default_slot_31(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Marital Status");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (89:8) <Input type="text" name="datasource_id" placeholder="Marital Status">
    function create_default_slot_30(ctx) {
    	let option0;
    	let t1;
    	let option1;
    	let t3;
    	let option2;
    	let t5;
    	let option3;

    	return {
    		c() {
    			option0 = element("option");
    			option0.textContent = "MARRIED";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "SINGLE";
    			t3 = space();
    			option2 = element("option");
    			option2.textContent = "DIVORCED";
    			t5 = space();
    			option3 = element("option");
    			option3.textContent = "WIDOWED";
    			option0.__value = "MARRIED";
    			option0.value = option0.__value;
    			option1.__value = "SINGLE";
    			option1.value = option1.__value;
    			option2.__value = "DIVORCED";
    			option2.value = option2.__value;
    			option3.__value = "WIDOWED";
    			option3.value = option3.__value;
    		},
    		m(target, anchor) {
    			insert(target, option0, anchor);
    			insert(target, t1, anchor);
    			insert(target, option1, anchor);
    			insert(target, t3, anchor);
    			insert(target, option2, anchor);
    			insert(target, t5, anchor);
    			insert(target, option3, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(option0);
    			if (detaching) detach(t1);
    			if (detaching) detach(option1);
    			if (detaching) detach(t3);
    			if (detaching) detach(option2);
    			if (detaching) detach(t5);
    			if (detaching) detach(option3);
    		}
    	};
    }

    // (88:6) <FormGroup>
    function create_default_slot_29(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				placeholder: "Marital Status",
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const input_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			input.$set(input_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (96:6) <Label for="name">
    function create_default_slot_28(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Annual Income");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (97:6) <FormGroup>
    function create_default_slot_27(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Annual Income"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (105:6) <Label for="name">
    function create_default_slot_26(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("City");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (106:6) <FormGroup>
    function create_default_slot_25(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "City"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (109:6) <Label for="name">
    function create_default_slot_24(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("State");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (110:6) <FormGroup>
    function create_default_slot_23(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "State"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (113:6) <Label for="name">
    function create_default_slot_22(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Country");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (114:6) <FormGroup>
    function create_default_slot_21(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Country"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (122:6) <Label for="name">
    function create_default_slot_20(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Pin");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (123:6) <FormGroup>
    function create_default_slot_19(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Pin"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (126:6) <Label for="name">
    function create_default_slot_18(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Landmark");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (127:6) <FormGroup>
    function create_default_slot_17(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Landmark"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (135:6) <Label for="name">
    function create_default_slot_16(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Address Line 1");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (136:6) <FormGroup>
    function create_default_slot_15(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Address Line 1"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (144:6) <Label for="name">
    function create_default_slot_14(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Pan Number");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (145:6) <FormGroup>
    function create_default_slot_13(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				placeholder: "Pan Number"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (148:6) <Label for="name">
    function create_default_slot_12(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Aadhaar Number");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (149:6) <FormGroup>
    function create_default_slot_11(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				placeholder: "Aadhar Number"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (152:6) <Label for="name">
    function create_default_slot_10(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Bank Name");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (154:8) <Input type="select" name="Bank Name" placeholder="Bank Name" required>
    function create_default_slot_9$1(ctx) {
    	let option0;
    	let t1;
    	let option1;
    	let t3;
    	let option2;
    	let t5;
    	let option3;

    	return {
    		c() {
    			option0 = element("option");
    			option0.textContent = "BANK OF BARODA";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "BASIN CATHOLIC BANK LIMITED";
    			t3 = space();
    			option2 = element("option");
    			option2.textContent = "CANADA BANK";
    			t5 = space();
    			option3 = element("option");
    			option3.textContent = "THE VARACHHA CO-OPERATIVE BANK";
    			option0.__value = "BANK OF BARODA";
    			option0.value = option0.__value;
    			option1.__value = "BASIN CATHOLIC BANK LIMITED";
    			option1.value = option1.__value;
    			option2.__value = "CANADA BANK";
    			option2.value = option2.__value;
    			option3.__value = "THE VARACHHA CO-OPERATIVE BANK";
    			option3.value = option3.__value;
    		},
    		m(target, anchor) {
    			insert(target, option0, anchor);
    			insert(target, t1, anchor);
    			insert(target, option1, anchor);
    			insert(target, t3, anchor);
    			insert(target, option2, anchor);
    			insert(target, t5, anchor);
    			insert(target, option3, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(option0);
    			if (detaching) detach(t1);
    			if (detaching) detach(option1);
    			if (detaching) detach(t3);
    			if (detaching) detach(option2);
    			if (detaching) detach(t5);
    			if (detaching) detach(option3);
    		}
    	};
    }

    // (153:6) <FormGroup>
    function create_default_slot_8$1(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "select",
    				name: "Bank Name",
    				placeholder: "Bank Name",
    				required: true,
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const input_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			input.$set(input_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (161:6) <Label for="name">
    function create_default_slot_7$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Bank Account Number");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (162:6) <FormGroup>
    function create_default_slot_6$1(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Account Number"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (170:6) <Label for="name">
    function create_default_slot_5$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Bank Account Type");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (172:8) <Input            type="text"            name="datasource_id"            required            placeholder="Account Type"          >
    function create_default_slot_4$2(ctx) {
    	let option0;
    	let t1;
    	let option1;

    	return {
    		c() {
    			option0 = element("option");
    			option0.textContent = "SAVING";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "CURRENT";
    			option0.__value = "SAVING";
    			option0.value = option0.__value;
    			option1.__value = "CURRENT";
    			option1.value = option1.__value;
    		},
    		m(target, anchor) {
    			insert(target, option0, anchor);
    			insert(target, t1, anchor);
    			insert(target, option1, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(option0);
    			if (detaching) detach(t1);
    			if (detaching) detach(option1);
    		}
    	};
    }

    // (171:6) <FormGroup>
    function create_default_slot_3$3(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "Account Type",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const input_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			input.$set(input_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (182:6) <Label for="name">
    function create_default_slot_2$3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Bank IFSC Code");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (183:6) <FormGroup>
    function create_default_slot_1$4(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				name: "datasource_id",
    				required: true,
    				placeholder: "IFSC Code"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (51:2) <CardBody>
    function create_default_slot$6(ctx) {
    	let form;
    	let label0;
    	let t0;
    	let formgroup0;
    	let t1;
    	let label1;
    	let t2;
    	let formgroup1;
    	let t3;
    	let label2;
    	let t4;
    	let formgroup2;
    	let t5;
    	let label3;
    	let t6;
    	let formgroup3;
    	let t7;
    	let label4;
    	let t8;
    	let formgroup4;
    	let t9;
    	let label5;
    	let t10;
    	let formgroup5;
    	let t11;
    	let label6;
    	let t12;
    	let formgroup6;
    	let t13;
    	let label7;
    	let t14;
    	let formgroup7;
    	let t15;
    	let label8;
    	let t16;
    	let formgroup8;
    	let t17;
    	let label9;
    	let t18;
    	let formgroup9;
    	let t19;
    	let label10;
    	let t20;
    	let formgroup10;
    	let t21;
    	let label11;
    	let t22;
    	let formgroup11;
    	let t23;
    	let label12;
    	let t24;
    	let formgroup12;
    	let t25;
    	let label13;
    	let t26;
    	let formgroup13;
    	let t27;
    	let label14;
    	let t28;
    	let formgroup14;
    	let t29;
    	let label15;
    	let t30;
    	let formgroup15;
    	let t31;
    	let label16;
    	let t32;
    	let formgroup16;
    	let t33;
    	let label17;
    	let t34;
    	let formgroup17;
    	let t35;
    	let label18;
    	let t36;
    	let formgroup18;
    	let current;

    	label0 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_42] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup0 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_41] },
    				$$scope: { ctx }
    			}
    		});

    	label1 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_40] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup1 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			}
    		});

    	label2 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup2 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			}
    		});

    	label3 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup3 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			}
    		});

    	label4 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup4 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			}
    		});

    	label5 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup5 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			}
    		});

    	label6 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup6 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			}
    		});

    	label7 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup7 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			}
    		});

    	label8 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup8 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			}
    		});

    	label9 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup9 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			}
    		});

    	label10 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup10 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			}
    		});

    	label11 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup11 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			}
    		});

    	label12 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup12 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			}
    		});

    	label13 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup13 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			}
    		});

    	label14 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup14 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			}
    		});

    	label15 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup15 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			}
    		});

    	label16 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup16 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			}
    		});

    	label17 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup17 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			}
    		});

    	label18 = new Label({
    			props: {
    				for: "name",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup18 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			form = element("form");
    			create_component(label0.$$.fragment);
    			t0 = space();
    			create_component(formgroup0.$$.fragment);
    			t1 = space();
    			create_component(label1.$$.fragment);
    			t2 = space();
    			create_component(formgroup1.$$.fragment);
    			t3 = space();
    			create_component(label2.$$.fragment);
    			t4 = space();
    			create_component(formgroup2.$$.fragment);
    			t5 = space();
    			create_component(label3.$$.fragment);
    			t6 = space();
    			create_component(formgroup3.$$.fragment);
    			t7 = space();
    			create_component(label4.$$.fragment);
    			t8 = space();
    			create_component(formgroup4.$$.fragment);
    			t9 = space();
    			create_component(label5.$$.fragment);
    			t10 = space();
    			create_component(formgroup5.$$.fragment);
    			t11 = space();
    			create_component(label6.$$.fragment);
    			t12 = space();
    			create_component(formgroup6.$$.fragment);
    			t13 = space();
    			create_component(label7.$$.fragment);
    			t14 = space();
    			create_component(formgroup7.$$.fragment);
    			t15 = space();
    			create_component(label8.$$.fragment);
    			t16 = space();
    			create_component(formgroup8.$$.fragment);
    			t17 = space();
    			create_component(label9.$$.fragment);
    			t18 = space();
    			create_component(formgroup9.$$.fragment);
    			t19 = space();
    			create_component(label10.$$.fragment);
    			t20 = space();
    			create_component(formgroup10.$$.fragment);
    			t21 = space();
    			create_component(label11.$$.fragment);
    			t22 = space();
    			create_component(formgroup11.$$.fragment);
    			t23 = space();
    			create_component(label12.$$.fragment);
    			t24 = space();
    			create_component(formgroup12.$$.fragment);
    			t25 = space();
    			create_component(label13.$$.fragment);
    			t26 = space();
    			create_component(formgroup13.$$.fragment);
    			t27 = space();
    			create_component(label14.$$.fragment);
    			t28 = space();
    			create_component(formgroup14.$$.fragment);
    			t29 = space();
    			create_component(label15.$$.fragment);
    			t30 = space();
    			create_component(formgroup15.$$.fragment);
    			t31 = space();
    			create_component(label16.$$.fragment);
    			t32 = space();
    			create_component(formgroup16.$$.fragment);
    			t33 = space();
    			create_component(label17.$$.fragment);
    			t34 = space();
    			create_component(formgroup17.$$.fragment);
    			t35 = space();
    			create_component(label18.$$.fragment);
    			t36 = space();
    			create_component(formgroup18.$$.fragment);
    		},
    		m(target, anchor) {
    			insert(target, form, anchor);
    			mount_component(label0, form, null);
    			append(form, t0);
    			mount_component(formgroup0, form, null);
    			append(form, t1);
    			mount_component(label1, form, null);
    			append(form, t2);
    			mount_component(formgroup1, form, null);
    			append(form, t3);
    			mount_component(label2, form, null);
    			append(form, t4);
    			mount_component(formgroup2, form, null);
    			append(form, t5);
    			mount_component(label3, form, null);
    			append(form, t6);
    			mount_component(formgroup3, form, null);
    			append(form, t7);
    			mount_component(label4, form, null);
    			append(form, t8);
    			mount_component(formgroup4, form, null);
    			append(form, t9);
    			mount_component(label5, form, null);
    			append(form, t10);
    			mount_component(formgroup5, form, null);
    			append(form, t11);
    			mount_component(label6, form, null);
    			append(form, t12);
    			mount_component(formgroup6, form, null);
    			append(form, t13);
    			mount_component(label7, form, null);
    			append(form, t14);
    			mount_component(formgroup7, form, null);
    			append(form, t15);
    			mount_component(label8, form, null);
    			append(form, t16);
    			mount_component(formgroup8, form, null);
    			append(form, t17);
    			mount_component(label9, form, null);
    			append(form, t18);
    			mount_component(formgroup9, form, null);
    			append(form, t19);
    			mount_component(label10, form, null);
    			append(form, t20);
    			mount_component(formgroup10, form, null);
    			append(form, t21);
    			mount_component(label11, form, null);
    			append(form, t22);
    			mount_component(formgroup11, form, null);
    			append(form, t23);
    			mount_component(label12, form, null);
    			append(form, t24);
    			mount_component(formgroup12, form, null);
    			append(form, t25);
    			mount_component(label13, form, null);
    			append(form, t26);
    			mount_component(formgroup13, form, null);
    			append(form, t27);
    			mount_component(label14, form, null);
    			append(form, t28);
    			mount_component(formgroup14, form, null);
    			append(form, t29);
    			mount_component(label15, form, null);
    			append(form, t30);
    			mount_component(formgroup15, form, null);
    			append(form, t31);
    			mount_component(label16, form, null);
    			append(form, t32);
    			mount_component(formgroup16, form, null);
    			append(form, t33);
    			mount_component(label17, form, null);
    			append(form, t34);
    			mount_component(formgroup17, form, null);
    			append(form, t35);
    			mount_component(label18, form, null);
    			append(form, t36);
    			mount_component(formgroup18, form, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label0_changes.$$scope = { dirty, ctx };
    			}

    			label0.$set(label0_changes);
    			const formgroup0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const label1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label1_changes.$$scope = { dirty, ctx };
    			}

    			label1.$set(label1_changes);
    			const formgroup1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const label2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label2_changes.$$scope = { dirty, ctx };
    			}

    			label2.$set(label2_changes);
    			const formgroup2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup2_changes.$$scope = { dirty, ctx };
    			}

    			formgroup2.$set(formgroup2_changes);
    			const label3_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label3_changes.$$scope = { dirty, ctx };
    			}

    			label3.$set(label3_changes);
    			const formgroup3_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup3_changes.$$scope = { dirty, ctx };
    			}

    			formgroup3.$set(formgroup3_changes);
    			const label4_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label4_changes.$$scope = { dirty, ctx };
    			}

    			label4.$set(label4_changes);
    			const formgroup4_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup4_changes.$$scope = { dirty, ctx };
    			}

    			formgroup4.$set(formgroup4_changes);
    			const label5_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label5_changes.$$scope = { dirty, ctx };
    			}

    			label5.$set(label5_changes);
    			const formgroup5_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup5_changes.$$scope = { dirty, ctx };
    			}

    			formgroup5.$set(formgroup5_changes);
    			const label6_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label6_changes.$$scope = { dirty, ctx };
    			}

    			label6.$set(label6_changes);
    			const formgroup6_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup6_changes.$$scope = { dirty, ctx };
    			}

    			formgroup6.$set(formgroup6_changes);
    			const label7_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label7_changes.$$scope = { dirty, ctx };
    			}

    			label7.$set(label7_changes);
    			const formgroup7_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup7_changes.$$scope = { dirty, ctx };
    			}

    			formgroup7.$set(formgroup7_changes);
    			const label8_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label8_changes.$$scope = { dirty, ctx };
    			}

    			label8.$set(label8_changes);
    			const formgroup8_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup8_changes.$$scope = { dirty, ctx };
    			}

    			formgroup8.$set(formgroup8_changes);
    			const label9_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label9_changes.$$scope = { dirty, ctx };
    			}

    			label9.$set(label9_changes);
    			const formgroup9_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup9_changes.$$scope = { dirty, ctx };
    			}

    			formgroup9.$set(formgroup9_changes);
    			const label10_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label10_changes.$$scope = { dirty, ctx };
    			}

    			label10.$set(label10_changes);
    			const formgroup10_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup10_changes.$$scope = { dirty, ctx };
    			}

    			formgroup10.$set(formgroup10_changes);
    			const label11_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label11_changes.$$scope = { dirty, ctx };
    			}

    			label11.$set(label11_changes);
    			const formgroup11_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup11_changes.$$scope = { dirty, ctx };
    			}

    			formgroup11.$set(formgroup11_changes);
    			const label12_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label12_changes.$$scope = { dirty, ctx };
    			}

    			label12.$set(label12_changes);
    			const formgroup12_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup12_changes.$$scope = { dirty, ctx };
    			}

    			formgroup12.$set(formgroup12_changes);
    			const label13_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label13_changes.$$scope = { dirty, ctx };
    			}

    			label13.$set(label13_changes);
    			const formgroup13_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup13_changes.$$scope = { dirty, ctx };
    			}

    			formgroup13.$set(formgroup13_changes);
    			const label14_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label14_changes.$$scope = { dirty, ctx };
    			}

    			label14.$set(label14_changes);
    			const formgroup14_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup14_changes.$$scope = { dirty, ctx };
    			}

    			formgroup14.$set(formgroup14_changes);
    			const label15_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label15_changes.$$scope = { dirty, ctx };
    			}

    			label15.$set(label15_changes);
    			const formgroup15_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup15_changes.$$scope = { dirty, ctx };
    			}

    			formgroup15.$set(formgroup15_changes);
    			const label16_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label16_changes.$$scope = { dirty, ctx };
    			}

    			label16.$set(label16_changes);
    			const formgroup16_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup16_changes.$$scope = { dirty, ctx };
    			}

    			formgroup16.$set(formgroup16_changes);
    			const label17_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label17_changes.$$scope = { dirty, ctx };
    			}

    			label17.$set(label17_changes);
    			const formgroup17_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup17_changes.$$scope = { dirty, ctx };
    			}

    			formgroup17.$set(formgroup17_changes);
    			const label18_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				label18_changes.$$scope = { dirty, ctx };
    			}

    			label18.$set(label18_changes);
    			const formgroup18_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				formgroup18_changes.$$scope = { dirty, ctx };
    			}

    			formgroup18.$set(formgroup18_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label0.$$.fragment, local);
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(label1.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(label2.$$.fragment, local);
    			transition_in(formgroup2.$$.fragment, local);
    			transition_in(label3.$$.fragment, local);
    			transition_in(formgroup3.$$.fragment, local);
    			transition_in(label4.$$.fragment, local);
    			transition_in(formgroup4.$$.fragment, local);
    			transition_in(label5.$$.fragment, local);
    			transition_in(formgroup5.$$.fragment, local);
    			transition_in(label6.$$.fragment, local);
    			transition_in(formgroup6.$$.fragment, local);
    			transition_in(label7.$$.fragment, local);
    			transition_in(formgroup7.$$.fragment, local);
    			transition_in(label8.$$.fragment, local);
    			transition_in(formgroup8.$$.fragment, local);
    			transition_in(label9.$$.fragment, local);
    			transition_in(formgroup9.$$.fragment, local);
    			transition_in(label10.$$.fragment, local);
    			transition_in(formgroup10.$$.fragment, local);
    			transition_in(label11.$$.fragment, local);
    			transition_in(formgroup11.$$.fragment, local);
    			transition_in(label12.$$.fragment, local);
    			transition_in(formgroup12.$$.fragment, local);
    			transition_in(label13.$$.fragment, local);
    			transition_in(formgroup13.$$.fragment, local);
    			transition_in(label14.$$.fragment, local);
    			transition_in(formgroup14.$$.fragment, local);
    			transition_in(label15.$$.fragment, local);
    			transition_in(formgroup15.$$.fragment, local);
    			transition_in(label16.$$.fragment, local);
    			transition_in(formgroup16.$$.fragment, local);
    			transition_in(label17.$$.fragment, local);
    			transition_in(formgroup17.$$.fragment, local);
    			transition_in(label18.$$.fragment, local);
    			transition_in(formgroup18.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label0.$$.fragment, local);
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(label1.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(label2.$$.fragment, local);
    			transition_out(formgroup2.$$.fragment, local);
    			transition_out(label3.$$.fragment, local);
    			transition_out(formgroup3.$$.fragment, local);
    			transition_out(label4.$$.fragment, local);
    			transition_out(formgroup4.$$.fragment, local);
    			transition_out(label5.$$.fragment, local);
    			transition_out(formgroup5.$$.fragment, local);
    			transition_out(label6.$$.fragment, local);
    			transition_out(formgroup6.$$.fragment, local);
    			transition_out(label7.$$.fragment, local);
    			transition_out(formgroup7.$$.fragment, local);
    			transition_out(label8.$$.fragment, local);
    			transition_out(formgroup8.$$.fragment, local);
    			transition_out(label9.$$.fragment, local);
    			transition_out(formgroup9.$$.fragment, local);
    			transition_out(label10.$$.fragment, local);
    			transition_out(formgroup10.$$.fragment, local);
    			transition_out(label11.$$.fragment, local);
    			transition_out(formgroup11.$$.fragment, local);
    			transition_out(label12.$$.fragment, local);
    			transition_out(formgroup12.$$.fragment, local);
    			transition_out(label13.$$.fragment, local);
    			transition_out(formgroup13.$$.fragment, local);
    			transition_out(label14.$$.fragment, local);
    			transition_out(formgroup14.$$.fragment, local);
    			transition_out(label15.$$.fragment, local);
    			transition_out(formgroup15.$$.fragment, local);
    			transition_out(label16.$$.fragment, local);
    			transition_out(formgroup16.$$.fragment, local);
    			transition_out(label17.$$.fragment, local);
    			transition_out(formgroup17.$$.fragment, local);
    			transition_out(label18.$$.fragment, local);
    			transition_out(formgroup18.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form);
    			destroy_component(label0);
    			destroy_component(formgroup0);
    			destroy_component(label1);
    			destroy_component(formgroup1);
    			destroy_component(label2);
    			destroy_component(formgroup2);
    			destroy_component(label3);
    			destroy_component(formgroup3);
    			destroy_component(label4);
    			destroy_component(formgroup4);
    			destroy_component(label5);
    			destroy_component(formgroup5);
    			destroy_component(label6);
    			destroy_component(formgroup6);
    			destroy_component(label7);
    			destroy_component(formgroup7);
    			destroy_component(label8);
    			destroy_component(formgroup8);
    			destroy_component(label9);
    			destroy_component(formgroup9);
    			destroy_component(label10);
    			destroy_component(formgroup10);
    			destroy_component(label11);
    			destroy_component(formgroup11);
    			destroy_component(label12);
    			destroy_component(formgroup12);
    			destroy_component(label13);
    			destroy_component(formgroup13);
    			destroy_component(label14);
    			destroy_component(formgroup14);
    			destroy_component(label15);
    			destroy_component(formgroup15);
    			destroy_component(label16);
    			destroy_component(formgroup16);
    			destroy_component(label17);
    			destroy_component(formgroup17);
    			destroy_component(label18);
    			destroy_component(formgroup18);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let div;
    	let cardheader;
    	let t;
    	let cardbody;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_43] },
    				$$scope: { ctx }
    			}
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			create_component(cardheader.$$.fragment);
    			t = space();
    			create_component(cardbody.$$.fragment);
    			attr(div, "class", "form-container");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(cardheader, div, null);
    			append(div, t);
    			mount_component(cardbody, div, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(cardheader);
    			destroy_component(cardbody);
    		}
    	};
    }

    function instance$6($$self) {

    	onMount(async () => {
    		request("/api/userauth/session/", "GET").then(data => {
    			data.user;
    		});
    	});

    	return [];
    }

    class KYC extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, {});
    	}
    }

    /* src\client\components\Footer.svelte generated by Svelte v3.55.1 */

    function create_default_slot$5(ctx) {
    	let div2;

    	return {
    		c() {
    			div2 = element("div");

    			div2.innerHTML = `<div class="text-muted">Made with ♥ by Spense ©</div> 
      <div><a href="#">Privacy Policy</a>
        ·
        <a href="#">Terms &amp; Conditions</a></div>`;

    			attr(div2, "class", "d-flex align-items-center justify-content-between small");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div2);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	let footer;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				fluid: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			footer = element("footer");
    			create_component(container.$$.fragment);
    			attr(footer, "class", "py-4 bg-light mt-auto");
    		},
    		m(target, anchor) {
    			insert(target, footer, anchor);
    			mount_component(container, footer, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(footer);
    			destroy_component(container);
    		}
    	};
    }

    class Footer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$6, safe_not_equal, {});
    	}
    }

    /* src\client\components\layout\PublicLayout.svelte generated by Svelte v3.55.1 */

    function create_default_slot_5$1(ctx) {
    	let center;
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[5]
    			}
    		});

    	return {
    		c() {
    			center = element("center");
    			create_component(route.$$.fragment);
    		},
    		m(target, anchor) {
    			insert(target, center, anchor);
    			mount_component(route, center, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(center);
    			destroy_component(route);
    		}
    	};
    }

    // (31:8) <Row class="justify-content-center">
    function create_default_slot_4$1(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				fluid: true,
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(container.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, currentRoute*/ 513) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(container, detaching);
    		}
    	};
    }

    // (30:6) <Container>
    function create_default_slot_3$2(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, currentRoute*/ 513) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    // (42:6) <ToastHeader class="bg-{toast_type} text-white" {toggle}          >
    function create_default_slot_2$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*toast_header*/ ctx[4]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*toast_header*/ 16) set_data(t, /*toast_header*/ ctx[4]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (45:6) <ToastBody>
    function create_default_slot_1$3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*toast_message*/ ctx[3]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*toast_message*/ 8) set_data(t, /*toast_message*/ ctx[3]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (41:4) <Toast autohide {isOpen} on:close={() => (isOpen = false)}>
    function create_default_slot$4(ctx) {
    	let toastheader;
    	let t;
    	let toastbody;
    	let current;

    	toastheader = new ToastHeader({
    			props: {
    				class: "bg-" + /*toast_type*/ ctx[2] + " text-white",
    				toggle: /*toggle*/ ctx[6],
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			}
    		});

    	toastbody = new ToastBody({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(toastheader.$$.fragment);
    			t = space();
    			create_component(toastbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(toastheader, target, anchor);
    			insert(target, t, anchor);
    			mount_component(toastbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const toastheader_changes = {};
    			if (dirty & /*toast_type*/ 4) toastheader_changes.class = "bg-" + /*toast_type*/ ctx[2] + " text-white";

    			if (dirty & /*$$scope, toast_header*/ 528) {
    				toastheader_changes.$$scope = { dirty, ctx };
    			}

    			toastheader.$set(toastheader_changes);
    			const toastbody_changes = {};

    			if (dirty & /*$$scope, toast_message*/ 520) {
    				toastbody_changes.$$scope = { dirty, ctx };
    			}

    			toastbody.$set(toastbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(toastheader.$$.fragment, local);
    			transition_in(toastbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(toastheader.$$.fragment, local);
    			transition_out(toastbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(toastheader, detaching);
    			if (detaching) detach(t);
    			destroy_component(toastbody, detaching);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let main;
    	let container;
    	let t0;
    	let footer;
    	let t1;
    	let div1;
    	let toast_1;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			}
    		});

    	footer = new Footer({});

    	toast_1 = new Toast({
    			props: {
    				autohide: true,
    				isOpen: /*isOpen*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			}
    		});

    	toast_1.$on("close", /*close_handler*/ ctx[7]);

    	return {
    		c() {
    			div2 = element("div");
    			div0 = element("div");
    			main = element("main");
    			create_component(container.$$.fragment);
    			t0 = space();
    			create_component(footer.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(toast_1.$$.fragment);
    			attr(div0, "id", "layoutAuthentication_content");
    			attr(div1, "id", "snackbar");
    			attr(div1, "class", "m-3 position-fixed bottom-0 end-0");
    			attr(div2, "id", "layoutAuthentication");
    			attr(div2, "class", "bg-primary");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, main);
    			mount_component(container, main, null);
    			append(div2, t0);
    			mount_component(footer, div2, null);
    			append(div2, t1);
    			append(div2, div1);
    			mount_component(toast_1, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope, currentRoute*/ 513) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    			const toast_1_changes = {};
    			if (dirty & /*isOpen*/ 2) toast_1_changes.isOpen = /*isOpen*/ ctx[1];

    			if (dirty & /*$$scope, toast_message, toast_type, toast_header*/ 540) {
    				toast_1_changes.$$scope = { dirty, ctx };
    			}

    			toast_1.$set(toast_1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(toast_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(toast_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div2);
    			destroy_component(container);
    			destroy_component(footer);
    			destroy_component(toast_1);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	const params = {};
    	let isOpen = false;
    	let toast_type = "info";
    	let toast_message = "";
    	let toast_header = "";

    	function toggle() {
    		$$invalidate(1, isOpen = !isOpen);
    	}

    	function toast(title, message, type = "default") {
    		$$invalidate(1, isOpen = false);
    		$$invalidate(2, toast_type = type);
    		$$invalidate(4, toast_header = title);
    		$$invalidate(3, toast_message = message);
    		toggle();
    	}

    	window.toast = toast;
    	const close_handler = () => $$invalidate(1, isOpen = false);

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	return [
    		currentRoute,
    		isOpen,
    		toast_type,
    		toast_message,
    		toast_header,
    		params,
    		toggle,
    		close_handler
    	];
    }

    class PublicLayout extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { currentRoute: 0 });
    	}
    }

    /* src\client\components\Navbar.svelte generated by Svelte v3.55.1 */

    function create_default_slot_9(ctx) {
    	let i;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", "fas fa-search");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    // (45:6) <InputGroup>
    function create_default_slot_8(ctx) {
    	let input;
    	let t;
    	let button;
    	let current;

    	input = new Input({
    			props: {
    				type: "search",
    				name: "search",
    				id: "exampleSearch",
    				placeholder: "Search for..."
    			}
    		});

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			}
    		});

    	button.$on("click", searchHandle);

    	return {
    		c() {
    			create_component(input.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			insert(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    			if (detaching) detach(t);
    			destroy_component(button, detaching);
    		}
    	};
    }

    // (44:4) <Form inline>
    function create_default_slot_7(ctx) {
    	let inputgroup;
    	let current;

    	inputgroup = new InputGroup({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(inputgroup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(inputgroup, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const inputgroup_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				inputgroup_changes.$$scope = { dirty, ctx };
    			}

    			inputgroup.$set(inputgroup_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(inputgroup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(inputgroup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(inputgroup, detaching);
    		}
    	};
    }

    // (59:8) <DropdownToggle nav caret>
    function create_default_slot_6(ctx) {
    	let i;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", "fas fa-user fa-fw ml-3");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    // (63:10) <DropdownItem>
    function create_default_slot_5(ctx) {
    	let a;

    	return {
    		c() {
    			a = element("a");
    			a.textContent = "Logout";
    			attr(a, "class", "dropdown-item");
    			attr(a, "href", "/logout");
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(a);
    		}
    	};
    }

    // (62:8) <DropdownMenu right>
    function create_default_slot_4(ctx) {
    	let dropdownitem;
    	let current;

    	dropdownitem = new DropdownItem({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(dropdownitem.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(dropdownitem, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const dropdownitem_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				dropdownitem_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem.$set(dropdownitem_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(dropdownitem.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dropdownitem.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(dropdownitem, detaching);
    		}
    	};
    }

    // (58:6) <Dropdown nav inNavbar>
    function create_default_slot_3$1(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			}
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				right: true,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(dropdowntoggle.$$.fragment);
    			t = space();
    			create_component(dropdownmenu.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				dropdownmenu_changes.$$scope = { dirty, ctx };
    			}

    			dropdownmenu.$set(dropdownmenu_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(dropdowntoggle.$$.fragment, local);
    			transition_in(dropdownmenu.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dropdowntoggle.$$.fragment, local);
    			transition_out(dropdownmenu.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(dropdowntoggle, detaching);
    			if (detaching) detach(t);
    			destroy_component(dropdownmenu, detaching);
    		}
    	};
    }

    // (57:4) <ListGroup class="ml-auto ml-md-0">
    function create_default_slot_2$1(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				nav: true,
    				inNavbar: true,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(dropdown.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};
    }

    // (43:2) <Nav class="ml-auto" navbar>
    function create_default_slot_1$2(ctx) {
    	let form;
    	let t;
    	let listgroup;
    	let current;

    	form = new Form({
    			props: {
    				inline: true,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			}
    		});

    	listgroup = new ListGroup({
    			props: {
    				class: "ml-auto ml-md-0",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(form.$$.fragment);
    			t = space();
    			create_component(listgroup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(form, target, anchor);
    			insert(target, t, anchor);
    			mount_component(listgroup, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    			const listgroup_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				listgroup_changes.$$scope = { dirty, ctx };
    			}

    			listgroup.$set(listgroup_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			transition_in(listgroup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(form.$$.fragment, local);
    			transition_out(listgroup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(form, detaching);
    			if (detaching) detach(t);
    			destroy_component(listgroup, detaching);
    		}
    	};
    }

    // (30:0) <Navbar class="sb-topnav navbar-expand" {color} dark expand="md">
    function create_default_slot$3(ctx) {
    	let div;
    	let t;
    	let nav;
    	let current;
    	let mounted;
    	let dispose;

    	nav = new Nav({
    			props: {
    				class: "ml-auto",
    				navbar: true,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    			t = space();
    			create_component(nav.$$.fragment);
    			attr(div, "class", "text-white");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			insert(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(div, "click", /*click_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (detaching) detach(t);
    			destroy_component(nav, detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				class: "sb-topnav navbar-expand",
    				color: /*color*/ ctx[1],
    				dark: true,
    				expand: "md",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const navbar_changes = {};
    			if (dirty & /*color*/ 2) navbar_changes.color = /*color*/ ctx[1];

    			if (dirty & /*$$scope, sideBarToggleClass*/ 17) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};
    }

    function searchHandle() {
    	event.preventDefault();
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { color } = $$props;
    	let { title } = $$props;
    	let { sideBarToggleClass } = $$props;

    	const click_handler = () => {
    		if (sideBarToggleClass === "") {
    			$$invalidate(0, sideBarToggleClass = "sb-sidenav-toggled");
    		} else {
    			$$invalidate(0, sideBarToggleClass = "");
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('sideBarToggleClass' in $$props) $$invalidate(0, sideBarToggleClass = $$props.sideBarToggleClass);
    	};

    	return [sideBarToggleClass, color, title, click_handler];
    }

    class Navbar_1 extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			color: 1,
    			title: 2,
    			sideBarToggleClass: 0
    		});
    	}
    }

    /* src\client\components\SidebarItem.svelte generated by Svelte v3.55.1 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (19:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let t0;
    	let span;
    	let t1_value = /*menu*/ ctx[1].title + "";
    	let t1;
    	let t2;
    	let i;
    	let t3;
    	let collapse;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*menu*/ ctx[1].icon != "" && create_if_block_2(ctx);

    	collapse = new Collapse({
    			props: {
    				isOpen: /*isOpen*/ ctx[0],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			i = element("i");
    			t3 = space();
    			create_component(collapse.$$.fragment);
    			attr(span, "class", "item svelte-u22zt9");
    			attr(i, "class", "fas fa-angle-down float-end");
    			attr(div, "class", "nav-link");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append(div, t0);
    			append(div, span);
    			append(span, t1);
    			append(div, t2);
    			append(div, i);
    			append(div, t3);
    			mount_component(collapse, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen(div, "click", /*click_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*menu*/ ctx[1].icon != "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*menu*/ 2) && t1_value !== (t1_value = /*menu*/ ctx[1].title + "")) set_data(t1, t1_value);
    			const collapse_changes = {};
    			if (dirty & /*isOpen*/ 1) collapse_changes.isOpen = /*isOpen*/ ctx[0];

    			if (dirty & /*$$scope, menu, path*/ 134) {
    				collapse_changes.$$scope = { dirty, ctx };
    			}

    			collapse.$set(collapse_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(collapse.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(collapse.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block) if_block.d();
    			destroy_component(collapse);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (9:0) {#if menu.menus === undefined}
    function create_if_block(ctx) {
    	let a;
    	let span;
    	let t0;
    	let t1_value = /*menu*/ ctx[1].title + "";
    	let t1;
    	let a_class_value;
    	let a_href_value;
    	let if_block = /*menu*/ ctx[1].icon != "" && create_if_block_1(ctx);

    	return {
    		c() {
    			a = element("a");
    			span = element("span");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr(span, "class", "item svelte-u22zt9");
    			attr(a, "class", a_class_value = "nav-link " + (/*path*/ ctx[2] === /*menu*/ ctx[1].url ? 'active' : ''));
    			attr(a, "href", a_href_value = /*menu*/ ctx[1].url);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    			append(a, span);
    			if (if_block) if_block.m(span, null);
    			append(span, t0);
    			append(span, t1);
    		},
    		p(ctx, dirty) {
    			if (/*menu*/ ctx[1].icon != "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(span, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*menu*/ 2 && t1_value !== (t1_value = /*menu*/ ctx[1].title + "")) set_data(t1, t1_value);

    			if (dirty & /*path, menu*/ 6 && a_class_value !== (a_class_value = "nav-link " + (/*path*/ ctx[2] === /*menu*/ ctx[1].url ? 'active' : ''))) {
    				attr(a, "class", a_class_value);
    			}

    			if (dirty & /*menu*/ 2 && a_href_value !== (a_href_value = /*menu*/ ctx[1].url)) {
    				attr(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(a);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (26:4) {#if menu.icon != ""}
    function create_if_block_2(ctx) {
    	let i;
    	let i_class_value;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", i_class_value = "fas " + /*menu*/ ctx[1].icon + " svelte-u22zt9");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*menu*/ 2 && i_class_value !== (i_class_value = "fas " + /*menu*/ ctx[1].icon + " svelte-u22zt9")) {
    				attr(i, "class", i_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    // (35:8) {#each menu.menus as menuItem}
    function create_each_block$1(ctx) {
    	let sidebaritem;
    	let current;

    	sidebaritem = new SidebarItem({
    			props: {
    				menu: /*menuItem*/ ctx[4],
    				path: /*path*/ ctx[2]
    			}
    		});

    	return {
    		c() {
    			create_component(sidebaritem.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(sidebaritem, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const sidebaritem_changes = {};
    			if (dirty & /*menu*/ 2) sidebaritem_changes.menu = /*menuItem*/ ctx[4];
    			if (dirty & /*path*/ 4) sidebaritem_changes.path = /*path*/ ctx[2];
    			sidebaritem.$set(sidebaritem_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(sidebaritem.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(sidebaritem.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(sidebaritem, detaching);
    		}
    	};
    }

    // (34:6) <Nav class="sb-sidenav-menu-nested">
    function create_default_slot_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*menu*/ ctx[1].menus;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*menu, path*/ 6) {
    				each_value = /*menu*/ ctx[1].menus;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (33:4) <Collapse {isOpen}>
    function create_default_slot$2(ctx) {
    	let nav;
    	let current;

    	nav = new Nav({
    			props: {
    				class: "sb-sidenav-menu-nested",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(nav.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope, menu, path*/ 134) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(nav, detaching);
    		}
    	};
    }

    // (12:6) {#if menu.icon != ""}
    function create_if_block_1(ctx) {
    	let i;
    	let i_class_value;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", i_class_value = "fas " + /*menu*/ ctx[1].icon + " svelte-u22zt9");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*menu*/ 2 && i_class_value !== (i_class_value = "fas " + /*menu*/ ctx[1].icon + " svelte-u22zt9")) {
    				attr(i, "class", i_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*menu*/ ctx[1].menus === undefined) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { menu = {
    		title: "",
    		icon: "",
    		url: "javascript:void(0)"
    	} } = $$props;

    	let { path = "/" } = $$props;
    	let { isOpen = false } = $$props;

    	const click_handler = () => {
    		$$invalidate(0, isOpen = !isOpen);
    	};

    	$$self.$$set = $$props => {
    		if ('menu' in $$props) $$invalidate(1, menu = $$props.menu);
    		if ('path' in $$props) $$invalidate(2, path = $$props.path);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    	};

    	return [isOpen, menu, path, click_handler];
    }

    class SidebarItem extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { menu: 1, path: 2, isOpen: 0 });
    	}
    }

    /* src\client\components\Sidebar.svelte generated by Svelte v3.55.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (38:6) {#each menus as menu}
    function create_each_block(ctx) {
    	let sidebaritem;
    	let current;

    	sidebaritem = new SidebarItem({
    			props: {
    				menu: /*menu*/ ctx[4],
    				path: /*path*/ ctx[0]
    			}
    		});

    	return {
    		c() {
    			create_component(sidebaritem.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(sidebaritem, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const sidebaritem_changes = {};
    			if (dirty & /*path*/ 1) sidebaritem_changes.path = /*path*/ ctx[0];
    			sidebaritem.$set(sidebaritem_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(sidebaritem.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(sidebaritem.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(sidebaritem, detaching);
    		}
    	};
    }

    // (33:2) <Nav      class="sb-sidenav {sidenav_theme} accordion sb-nav-fixed"      id="sidenavAccordion"    >
    function create_default_slot$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*menus*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(div, "class", "sb-sidenav-menu");
    			set_style(div, "overflow-x", "hidden", 1);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*menus, path*/ 5) {
    				each_value = /*menus*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let div;
    	let nav;
    	let current;

    	nav = new Nav({
    			props: {
    				class: "sb-sidenav " + /*sidenav_theme*/ ctx[1] + " accordion sb-nav-fixed",
    				id: "sidenavAccordion",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			attr(div, "id", "layoutSidenav_nav");
    			attr(div, "class", "sb-nav-fixed");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(nav, div, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const nav_changes = {};
    			if (dirty & /*sidenav_theme*/ 2) nav_changes.class = "sb-sidenav " + /*sidenav_theme*/ ctx[1] + " accordion sb-nav-fixed";

    			if (dirty & /*$$scope, path*/ 129) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(nav);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let sidenav_theme;
    	let path = "";

    	onMount(() => {
    		$$invalidate(0, path = window.location.pathname);
    	});

    	let { theme } = $$props;

    	let menus = [
    		/*{
      title: "Admin",
      icon: "fa-users",
      menus: [
        {
          title: "User",
          icon: "fa-users",
          url: "/users",
        },
        {
          title: "Account Profile",
          icon: "fa-users",
          url: "/users",
        },
      ],
    },*/
    		{
    			title: "Datasource",
    			icon: "fa-database",
    			url: "/"
    		}
    	];

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(3, theme = $$props.theme);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*theme*/ 8) {
    			$$invalidate(1, sidenav_theme = `sb-sidenav-${theme}`);
    		}
    	};

    	return [path, sidenav_theme, menus, theme];
    }

    class Sidebar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { theme: 3 });
    	}
    }

    /* src\client\components\layout\DashboardLayout.svelte generated by Svelte v3.55.1 */

    function create_default_slot_3(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[6]
    			}
    		});

    	return {
    		c() {
    			create_component(route.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const route_changes = {};
    			if (dirty & /*currentRoute*/ 1) route_changes.currentRoute = /*currentRoute*/ ctx[0];
    			route.$set(route_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(route, detaching);
    		}
    	};
    }

    // (48:6) <ToastHeader class="bg-{toast_type} text-white" {toggle}          >
    function create_default_slot_2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*toast_header*/ ctx[5]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*toast_header*/ 32) set_data(t, /*toast_header*/ ctx[5]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (51:6) <ToastBody>
    function create_default_slot_1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*toast_message*/ ctx[4]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*toast_message*/ 16) set_data(t, /*toast_message*/ ctx[4]);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (47:4) <Toast autohide {isOpen} on:close={() => (isOpen = false)}>
    function create_default_slot(ctx) {
    	let toastheader;
    	let t;
    	let toastbody;
    	let current;

    	toastheader = new ToastHeader({
    			props: {
    				class: "bg-" + /*toast_type*/ ctx[3] + " text-white",
    				toggle: /*toggle*/ ctx[7],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			}
    		});

    	toastbody = new ToastBody({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(toastheader.$$.fragment);
    			t = space();
    			create_component(toastbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(toastheader, target, anchor);
    			insert(target, t, anchor);
    			mount_component(toastbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const toastheader_changes = {};
    			if (dirty & /*toast_type*/ 8) toastheader_changes.class = "bg-" + /*toast_type*/ ctx[3] + " text-white";

    			if (dirty & /*$$scope, toast_header*/ 2080) {
    				toastheader_changes.$$scope = { dirty, ctx };
    			}

    			toastheader.$set(toastheader_changes);
    			const toastbody_changes = {};

    			if (dirty & /*$$scope, toast_message*/ 2064) {
    				toastbody_changes.$$scope = { dirty, ctx };
    			}

    			toastbody.$set(toastbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(toastheader.$$.fragment, local);
    			transition_in(toastbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(toastheader.$$.fragment, local);
    			transition_out(toastbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(toastheader, detaching);
    			if (detaching) detach(t);
    			destroy_component(toastbody, detaching);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let title_value;
    	let t0;
    	let div3;
    	let navbar;
    	let updating_sideBarToggleClass;
    	let t1;
    	let div1;
    	let sidebar;
    	let t2;
    	let div0;
    	let main;
    	let container;
    	let t3;
    	let footer;
    	let t4;
    	let div2;
    	let toast_1;
    	let div3_class_value;
    	let current;
    	document.title = title_value = title;

    	function navbar_sideBarToggleClass_binding(value) {
    		/*navbar_sideBarToggleClass_binding*/ ctx[8](value);
    	}

    	let navbar_props = { color, title };

    	if (/*sideBarToggleClass*/ ctx[1] !== void 0) {
    		navbar_props.sideBarToggleClass = /*sideBarToggleClass*/ ctx[1];
    	}

    	navbar = new Navbar_1({ props: navbar_props });
    	binding_callbacks.push(() => bind(navbar, 'sideBarToggleClass', navbar_sideBarToggleClass_binding));
    	sidebar = new Sidebar({ props: { theme } });

    	container = new Container({
    			props: {
    				fluid: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			}
    		});

    	footer = new Footer({});

    	toast_1 = new Toast({
    			props: {
    				autohide: true,
    				isOpen: /*isOpen*/ ctx[2],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			}
    		});

    	toast_1.$on("close", /*close_handler*/ ctx[9]);

    	return {
    		c() {
    			t0 = space();
    			div3 = element("div");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(sidebar.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			main = element("main");
    			create_component(container.$$.fragment);
    			t3 = space();
    			create_component(footer.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			create_component(toast_1.$$.fragment);
    			attr(div0, "id", "layoutSidenav_content");
    			attr(div1, "id", "layoutSidenav");
    			attr(div2, "id", "snackbar");
    			attr(div2, "class", "m-3 position-fixed bottom-0 end-0");
    			attr(div3, "class", div3_class_value = "sb-nav-fixed " + /*sideBarToggleClass*/ ctx[1]);
    		},
    		m(target, anchor) {
    			insert(target, t0, anchor);
    			insert(target, div3, anchor);
    			mount_component(navbar, div3, null);
    			append(div3, t1);
    			append(div3, div1);
    			mount_component(sidebar, div1, null);
    			append(div1, t2);
    			append(div1, div0);
    			append(div0, main);
    			mount_component(container, main, null);
    			append(div0, t3);
    			mount_component(footer, div0, null);
    			append(div3, t4);
    			append(div3, div2);
    			mount_component(toast_1, div2, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if ((!current || dirty & /*title*/ 0) && title_value !== (title_value = title)) {
    				document.title = title_value;
    			}

    			const navbar_changes = {};

    			if (!updating_sideBarToggleClass && dirty & /*sideBarToggleClass*/ 2) {
    				updating_sideBarToggleClass = true;
    				navbar_changes.sideBarToggleClass = /*sideBarToggleClass*/ ctx[1];
    				add_flush_callback(() => updating_sideBarToggleClass = false);
    			}

    			navbar.$set(navbar_changes);
    			const container_changes = {};

    			if (dirty & /*$$scope, currentRoute*/ 2049) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    			const toast_1_changes = {};
    			if (dirty & /*isOpen*/ 4) toast_1_changes.isOpen = /*isOpen*/ ctx[2];

    			if (dirty & /*$$scope, toast_message, toast_type, toast_header*/ 2104) {
    				toast_1_changes.$$scope = { dirty, ctx };
    			}

    			toast_1.$set(toast_1_changes);

    			if (!current || dirty & /*sideBarToggleClass*/ 2 && div3_class_value !== (div3_class_value = "sb-nav-fixed " + /*sideBarToggleClass*/ ctx[1])) {
    				attr(div3, "class", div3_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(container.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(toast_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(container.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(toast_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(t0);
    			if (detaching) detach(div3);
    			destroy_component(navbar);
    			destroy_component(sidebar);
    			destroy_component(container);
    			destroy_component(footer);
    			destroy_component(toast_1);
    		}
    	};
    }

    let theme = "dark";
    let color = "dark";
    let title = "Application";

    function instance$1($$self, $$props, $$invalidate) {
    	let sideBarToggleClass = "";
    	let { currentRoute } = $$props;
    	const params = {};
    	let isOpen = false;
    	let toast_type = "info";
    	let toast_message = "";
    	let toast_header = "";

    	function toggle() {
    		$$invalidate(2, isOpen = !isOpen);
    	}

    	function toast(title, message, type = "default") {
    		$$invalidate(2, isOpen = false);
    		$$invalidate(3, toast_type = type);
    		$$invalidate(5, toast_header = title);
    		$$invalidate(4, toast_message = message);
    		toggle();
    	}

    	window.toast = toast;

    	function navbar_sideBarToggleClass_binding(value) {
    		sideBarToggleClass = value;
    		$$invalidate(1, sideBarToggleClass);
    	}

    	const close_handler = () => $$invalidate(2, isOpen = false);

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	return [
    		currentRoute,
    		sideBarToggleClass,
    		isOpen,
    		toast_type,
    		toast_message,
    		toast_header,
    		params,
    		toggle,
    		navbar_sideBarToggleClass_binding,
    		close_handler
    	];
    }

    class DashboardLayout extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { currentRoute: 0 });
    	}
    }

    const routes = [
      {
        name: "/sendtoken",
        component: SendToken,
        layout: PublicLayout,
      },
      {
        name: "/kyc",
        component: KYC,
        layout: DashboardLayout,
      },
      {
        name: "/splash",
        component: Splash,
        layout: DashboardLayout,
      },
      {
        name: "/landing",
        component: Landing,
        layout: DashboardLayout,
      },
      {
        name: "404",
        path: "404",
        component: NotFound,
        layout: PublicLayout,
      },
    ];

    /* src\client\App.svelte generated by Svelte v3.55.1 */

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				routes,
    				currentRoute: /*currentRoute*/ ctx[0],
    				params: /*params*/ ctx[1]
    			}
    		});

    	return {
    		c() {
    			create_component(router.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*currentRoute*/ 1) router_changes.currentRoute = /*currentRoute*/ ctx[0];
    			router.$set(router_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(router, detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	const params = {};

    	$$self.$$set = $$props => {
    		if ('currentRoute' in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	return [currentRoute, params];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { currentRoute: 0 });
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
