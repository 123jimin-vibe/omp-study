+++
id = "n0019"
title = "OMP multi-agent automation and collaboration"
parent = "n0004"
+++

# OMP multi-agent, automation, and collaboration

## Delegated agents

The `task` subsystem discovers built-in and user/project agent definitions, validates requested roles and tool/model constraints, spawns child sessions, enforces concurrency and recursion limits, and returns their results to the parent. Subagents have their own transcripts and lifecycle but share explicitly supplied context and selected process-global coordination facilities ([agent discovery](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/task-agent-discovery.md), [`task` tool](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools/task.md)).

## Coordination plane

`hub` combines three related control families:

- peer messages over a process-global mailbox bus;
- background job listing, waiting, cancellation, and completion delivery;
- supervision of shared long-running processes through a broker.

An agent registry/lifecycle layer makes live or parked recipients addressable, while session injection wakes a recipient when a message requires another turn ([hub tool](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/tools/hub.md)). The interactive Agent Hub adds roster, status/usage, transcript viewing, steering, revive, and kill controls ([Agent Hub](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/agent-hub.md)).

## Workflow control

Plan mode, goals, to-dos, checkpoints/rewind, asynchronous jobs, advisor/watchdog, auto-learning, and auto-research are separate policy subsystems coordinated by the main session. Hidden control tools such as `goal` and `yield` are conditionally advertised only when the corresponding runtime state needs them ([source layout](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/DEVELOPMENT.md), [tool registry](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/coding-agent/src/tools/index.ts)).

## Human collaboration

`/collab` connects a host session to a relay and the `collab-web` browser client. The guest can follow streaming transcript/tool cards and subagent views, answer prompts, and interrupt the host; `pi-wire` supplies shared protocol contracts. Room secrets remain in the URL fragment rather than being sent to the relay ([collaboration guide](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/docs/collab.md), [collab-web README](https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec/packages/collab-web/README.md)).

## Harness lesson

Delegation and coordination are different components. `task` creates work; `hub` moves signals and controls shared processes; the Agent Hub observes; collaboration gives a human a remote control surface. Keeping these planes separate makes ownership, wake-up behavior, and cancellation explicit.
