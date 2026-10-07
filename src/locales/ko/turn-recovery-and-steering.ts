import { topic, section, p, table, paths, refs } from './chapter-blocks.ts';

export const turnRecoveryTopic = topic('turn-recovery-and-steering', '실행 복구와 개입', '오류가 난 요청을 복구하고, 모델에게 남은 작업을 알려 주는 기능.',
  section('retry', '실패를 분류하고 다시 시도하기',
    p("모델 API 요청이 실패하면 `AgentSession`의 `TurnRecovery`가 재시도 여부를 판단합니다. 429 응답이나 일시적인 서버·네트워크 오류에는 재시도를 검토하고, 컨텍스트 한도를 넘었을 때는 입력을 압축합니다."),
    paths('같은 요청을 다시 보내도 되는가', '모델 연결이 끊겼습니다. 이미 전달된 결과에 따라 복구가 달라집니다.', [
      { label: '출력 전 실패', stages: [['재실행 검사', '확정된 본문·이미지·실행 결과가 없습니다.', 'complete'], ['재시도', '대기 후 요청을 다시 보냅니다.', 'complete']], result: '완료한 작업이 없는 실패 응답을 버리고 다시 생성합니다.' },
      { label: '도구 실행 완료', stages: [['재실행 검사', '도구 호출과 실행 결과가 이미 기록되어 있습니다.', 'complete'], ['이어가기', '완료된 호출과 결과를 보존합니다.', 'complete']], result: '파일 수정처럼 이미 끝난 작업을 다시 실행하지 않도록 기존 호출과 결과를 남겨 두고 이어갑니다.' },
      { label: '본문 출력 후 중단', stages: [['재실행 검사', '사용자에게 보인 본문을 그대로 다시 생성하면 중복됩니다.', 'blocked'], ['복구 알림', '지원되는 스트림 중단 복구는 이어 쓰기 지침을 추가합니다.', 'complete']], result: '부분 응답을 보존하고 중단 지점부터 이어갑니다. 복구 횟수에는 상한이 있습니다.' },
    ]),
    p("기본 대기 시간은 500ms부터 배수로 늘려 8초까지 올립니다. 대기 시간은 무작위로 조금 조정해 여러 요청이 한꺼번에 몰리지 않게 합니다. 제공자가 기다리라고 지정한 시간은 이보다 길 수 있습니다. 다른 인증 정보나 `retry.fallbackChains`의 모델로 다시 시도하기도 합니다. 중단 요청이 오면 기다리는 일과 예정된 재시도를 모두 취소합니다."),
    refs('docs/non-compaction-retry-policy.md', 'packages/coding-agent/src/session/turn-recovery.ts'),
  ),
  section('reminders', '하네스가 추가하는 메시지',
    p("하네스는 모델에게 사용자 입력뿐 아니라 작업 중 생긴 문제도 알려 줍니다. 응답이 비었거나 길이 제한에 걸린 경우, 호출이 잘못됐거나 같은 호출을 반복한 경우, 예상치 못하게 멈춘 경우에 복구 지침을 덧붙입니다. 미완료 todo나 다른 에이전트의 메시지도 다음 요청에 함께 보냅니다."),
    table('도구 사용 요구를 단계적으로 적용하기', ['단계', '동작'], [['soft requirement', '필요한 도구와 이유를 알림으로 전달'], ['요구한 도구를 쓰지 않음', '다음 턴의 toolChoice를 해당 도구로 강제'], ['반복해서 실패', '최대 3회의 강제 시도 뒤 종료하여 무한 반복 방지']]),
    p("`ToolChoiceQueue`는 모델이 아직 수행하지 않은 도구 호출 요구를 보관합니다. 예를 들어 AST 편집안을 확정하지 않고 넘어갔다면 다음 요청에서 이를 다시 요구할 수 있습니다. 도구 사용을 요구하는 알림이 있어도, 실행할 때는 평소와 같이 인자를 검사하고 승인 정책을 확인합니다."),
    refs('packages/agent/src/agent-loop.ts', 'packages/coding-agent/src/session/turn-recovery.ts', 'packages/coding-agent/src/prompts/system/tool-call-loop-redirect.md', 'packages/coding-agent/src/session/tool-choice-queue.ts'),
  ),
);
