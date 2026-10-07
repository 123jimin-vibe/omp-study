import { topic, section, p, table, paths, refs } from './chapter-blocks.ts';

export const turnRecoveryTopic = topic('turn-recovery-and-steering', '실행 복구와 개입', '실패한 응답을 이어 가고 필요한 행동을 다시 요청하는 세션의 제어 기능.',
  section('retry', '실패를 분류하고 다시 시도하기',
    p('모델 API가 실패하면 `AgentSession`의 `TurnRecovery`가 다시 시도할 수 있는지 판단합니다. 429·일시적인 서버·네트워크 오류와 컨텍스트 초과는 처리 방식이 다릅니다. 컨텍스트 초과는 압축으로 넘깁니다.'),
    paths('같은 요청을 다시 보내도 되는가', '모델 연결이 끊겼습니다. 이미 전달된 결과에 따라 복구가 달라집니다.', [
      { label: '출력 전 실패', stages: [['재실행 검사', '확정된 본문·이미지·실행 결과가 없습니다.', 'complete'], ['재시도', '대기 후 요청을 다시 보냅니다.', 'complete']], result: '안전하게 버릴 수 있는 실패 응답을 제거하고 다시 생성합니다.' },
      { label: '도구 실행 완료', stages: [['재실행 검사', '도구 호출과 실행 결과가 이미 기록되어 있습니다.', 'complete'], ['이어가기', '완료된 호출과 결과를 보존합니다.', 'complete']], result: '이미 실행한 부작용을 반복하지 않도록 기존 기록에서 이어갑니다.' },
      { label: '본문 출력 후 중단', stages: [['재실행 검사', '사용자에게 보인 본문을 그대로 다시 생성하면 중복됩니다.', 'blocked'], ['복구 알림', '지원되는 스트림 중단 복구는 이어 쓰기 지침을 추가합니다.', 'complete']], result: '부분 응답을 보존하고 중단 지점부터 이어갑니다. 복구 횟수에는 상한이 있습니다.' },
    ]),
    p('기본 재시도 대기는 500ms에서 배수로 늘어나고 기본 계산은 8초에서 상한에 도달하며 jitter를 적용합니다. 제공자가 지정한 대기 시간은 이보다 길 수 있습니다. 자격 증명을 바꾸거나 `retry.fallbackChains`의 모델로 전환하는 경우도 있습니다. 중단 요청은 대기와 예정된 재시도를 취소합니다.'),
    refs('docs/non-compaction-retry-policy.md', 'packages/coding-agent/src/session/turn-recovery.ts'),
  ),
  section('reminders', '하네스가 추가하는 메시지',
    p('모델 입력에는 사용자 글 외에 런타임이 만든 알림도 들어갑니다. 빈 응답, 길이 제한, 잘못된 호출, 반복 호출, 예상치 못한 종료를 감지하면 복구 지침을 넣습니다. todo가 남은 채 멈추면 미완료 작업을 알리고, 다른 에이전트의 메시지는 다음 판단에 전달됩니다.'),
    table('도구 사용 요구를 단계적으로 적용하기', ['단계', '동작'], [['soft requirement', '필요한 도구와 이유를 알림으로 전달'], ['요구를 놓침', '다음 턴의 toolChoice를 해당 도구로 강제'], ['반복해서 실패', '최대 3회의 강제 시도 뒤 종료하여 무한 반복 방지']]),
    p('`ToolChoiceQueue`는 이런 요구를 큐로 다룹니다. AST 편집의 미확정 제안을 남겨 둔 경우처럼, 모델이 다음에 해야 할 일을 하네스가 기억할 때 사용합니다. 알림의 역할·우선순위와 실행 권한은 별개이므로 실제 호출은 도구 검증과 승인 정책을 거칩니다.'),
    refs('packages/agent/src/agent-loop.ts', 'packages/coding-agent/src/session/turn-recovery.ts', 'packages/coding-agent/src/prompts/system/tool-call-loop-redirect.md', 'packages/coding-agent/src/session/tool-choice-queue.ts'),
  ),
);
