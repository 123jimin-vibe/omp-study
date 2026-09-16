import type { ExchangeBlock } from '../content.ts';
import { el, icon } from './dom.ts';

export function createExchangeExample(data: ExchangeBlock): HTMLElement {
  const figure = el('figure', 'learning-figure exchange-example');
  const flow = el('div', 'exchange-flow');
  const input = el('div', 'exchange-port exchange-input');
  input.append(el('p', 'exchange-label', data.input.label), el('p', 'exchange-text', data.input.text));

  const connector = el('div', 'exchange-connector');
  connector.append(icon('right'));
  connector.setAttribute('aria-hidden', 'true');
  const outputs = el('div', 'exchange-outputs');
  for (const output of data.outputs) {
    const port = el('div', 'exchange-port exchange-output');
    port.append(el('p', 'exchange-label', output.label), el('p', 'exchange-text', output.text));
    outputs.append(port);
  }
  if (data.outputs.length > 1) flow.classList.add('exchange-branch');
  flow.append(input, connector, outputs);
  figure.append(flow);
  return figure;
}
