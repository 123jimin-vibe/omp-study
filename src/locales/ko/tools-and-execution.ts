import type { Topic } from '../../content.ts';

const source = 'https://github.com/can1357/oh-my-pi/blob/3b3a6dc9bbd85102ce19d0b1c11bf6870915f6ec';

export const fileReadingAndSearchTopic: Topic = {
  id: 'file-reading-and-search',
  number: '09',
  title: '파일 읽기와 검색',
  description: '파일 이름과 내용의 단서를 좁혀 필요한 원문만 모델의 문맥으로 가져오는 도구.',
  sections: [
    {
      id: 'find-the-relevant-source',
      title: '이름에서 내용으로 범위를 좁힌다',
      blocks: [
        {
          kind: 'paragraph',
          text: '큰 저장소에서 처음부터 긴 파일을 읽으면 관련 없는 내용이 모델의 문맥을 차지합니다. OMP는 파일 이름을 찾는 `glob`, 파일 안의 정규식 일치를 찾는 `grep`, 선택한 원문을 가져오는 `read`를 나눕니다. 하네스는 앞 단계의 결과를 다음 도구의 좁은 입력으로 바꾸어야 합니다.',
        },
        {
          kind: 'paragraph',
          text: '예를 들어 실행 중 `Unknown model alias "fast"` 오류가 났고, 별칭을 해석하는 구현을 찾아야 한다고 합시다. 기대 결과는 오류 문자열을 만드는 파일과 별칭을 조회하는 함수의 본문을 확보하는 것입니다.',
        },
        {
          kind: 'tool-sequence',
          title: '후보 파일을 찾고 관련 줄만 읽기',
          prompt: '`Unknown model alias "fast"`를 만드는 구현과 별칭 조회 함수를 찾아 줘.',
          actors: ['모델', 'OMP 검색 도구', '작업 공간'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`glob` 호출', detail: '`packages/coding-agent/src/**/*model*.ts`로 이름이 관련된 후보를 찾습니다.', correlation: 'lookup-1' },
            { from: 1, to: 2, kind: 'read', label: '파일 목록 조사', detail: '작업 디렉터리를 기준으로 파일 트리를 훑고 무시 규칙을 적용합니다.', correlation: 'lookup-1' },
            { from: 2, to: 1, kind: 'result', label: '후보 목록', detail: '최근 수정 순서로 정리한 파일 이름과 결과 제한 정보를 돌려줍니다.', correlation: 'lookup-1' },
            { from: 1, to: 0, kind: 'result', label: '`glob` 결과', detail: '모델이 내용 검색 범위를 좁힐 후보 경로를 받습니다.', correlation: 'lookup-1' },
            { from: 0, to: 1, kind: 'call', label: '`grep` 호출', detail: '후보 범위에서 `Unknown model alias`를 검색합니다.', correlation: 'lookup-2' },
            { from: 1, to: 2, kind: 'read', label: '내용 검색', detail: '정규식을 후보 파일에 적용하고 일치 줄의 앞뒤 문맥을 모읍니다.', correlation: 'lookup-2' },
            { from: 2, to: 1, kind: 'result', label: '내용 일치', detail: '파일별로 묶은 일치 줄, 주변 문맥, 줄 번호와 스냅샷 태그를 돌려줍니다.', correlation: 'lookup-2' },
            { from: 1, to: 0, kind: 'result', label: '`grep` 결과', detail: '모델이 원문으로 확인할 파일과 줄 범위를 받습니다.', correlation: 'lookup-2' },
            { from: 0, to: 1, kind: 'call', label: '`read` 호출', detail: '일치 줄을 포함한 함수 범위만 지정해 읽습니다.', correlation: 'lookup-3' },
            { from: 1, to: 2, kind: 'read', label: '범위 읽기', detail: '선택한 파일의 원문과 경계 주변 문맥을 가져옵니다.', correlation: 'lookup-3' },
            { from: 2, to: 1, kind: 'result', label: '선택한 원문', detail: '요청한 줄과 파일 경계, 새 스냅샷 태그를 돌려줍니다.', correlation: 'lookup-3' },
            { from: 1, to: 0, kind: 'result', label: '조사 근거', detail: '오류를 만드는 조건과 별칭 조회 함수가 다음 모델 요청에 들어갑니다.', correlation: 'lookup-3' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 순서에서 모델은 검색어와 읽을 범위를 정하고, OMP의 도구 구현이 실제 파일 시스템을 조사합니다. 빈 검색 결과도 중요한 결과입니다. 하네스는 “없다”는 텍스트뿐 아니라 어떤 디렉터리와 무시 규칙, 결과 제한으로 조사했는지를 보존해야 다음 요청에서 범위를 바꿀 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · glob 도구 계약과 검색 범위', href: `${source}/docs/tools/glob.md` },
            { text: 'OMP · grep 도구 계약과 결과 형식', href: `${source}/docs/tools/grep.md` },
            { text: 'OMP · read 도구 계약과 선택자', href: `${source}/docs/tools/read.md` },
          ],
        },
      ],
    },
    {
      id: 'choose-the-smallest-scope',
      title: '질문에 맞는 도구와 범위를 고른다',
      blocks: [
        {
          kind: 'execution-path',
          title: '같은 저장소에서도 질문에 따라 시작점이 달라진다',
          input: { label: '주어진 단서', text: '`src` 아래에서 요청 취소를 처리하는 TypeScript 구현을 조사한다.' },
          labels: { choose: '조사 방법 선택' },
          paths: [
            {
              label: '파일 이름을 안다',
              stages: [
                { label: '`glob`', text: '`src/**/*abort*.ts`처럼 파일 이름 패턴으로 후보를 찾습니다.', state: 'complete' },
                { label: '`read`', text: '후보의 선언과 호출부를 필요한 줄 범위로 읽습니다.', state: 'complete' },
                { label: '`grep`', text: '원문만으로 답이 충분하면 내용 검색을 생략합니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '적은 수의 파일에서 취소 구현을 확인합니다.' },
            },
            {
              label: '식별자를 안다',
              stages: [
                { label: '`grep`', text: '`AbortController|AbortSignal`을 `src/**/*.ts`에서 찾습니다.', state: 'complete' },
                { label: '파일별 결과', text: '일치 줄과 주변 문맥으로 선언 코드, 전달 코드, 처리 코드를 구분합니다.', state: 'complete' },
                { label: '`read`', text: '실제 제어 흐름이 있는 함수만 다시 읽습니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '문자열 일치에서 실행 문맥으로 조사 범위를 좁힙니다.' },
            },
            {
              label: '정확한 파일을 안다',
              stages: [
                { label: '`read`', text: '`src/runtime.ts:120-190`처럼 필요한 범위를 바로 요청합니다.', state: 'complete' },
                { label: '목록 검색', text: '이미 대상이 정해졌으므로 전체 트리 탐색은 하지 않습니다.', state: 'skipped' },
                { label: '내용 검색', text: '호출부를 더 찾아야 할 때만 별도로 실행합니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '가장 짧은 호출로 확인할 원문을 얻습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '`glob`과 디렉터리 대상 `grep`은 기본적으로 `.gitignore`를 따릅니다. 생성물이나 벤더 코드를 의도적으로 조사할 때만 `gitignore: false`로 바꿉니다. 두 도구 모두 숨김 파일은 기본 검색 대상이므로, 비밀 파일을 모델 문맥에 넣지 않도록 하네스의 읽기 권한과 검색 루트를 별도로 제한해야 합니다.',
        },
        {
          kind: 'paragraph',
          text: 'OMP의 기본 로컬 구현에서 `glob`은 최대 200개 결과를 반환하고, 여러 파일을 훑는 `grep`은 한 번에 20개 파일을 보여 준 뒤 `skip`으로 다음 묶음을 요청하게 합니다. `read`의 열린 범위는 기본 300줄이며 `:A-B`, `:A+C`, 여러 범위 선택자를 지원합니다. 모델에게 잘린 결과만 넘기지 말고 다음 오프셋과 전체 규모를 함께 전달해야 조사가 끝났는지 판단할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · glob의 무시 규칙과 결과 제한', href: `${source}/packages/coding-agent/src/tools/glob.ts` },
            { text: 'OMP · grep의 파일별 묶음과 페이지 처리', href: `${source}/packages/coding-agent/src/tools/grep.ts` },
            { text: 'OMP · read의 줄 범위 해석', href: `${source}/packages/coding-agent/src/tools/read-selector.ts` },
          ],
        },
      ],
    },
    {
      id: 'results-that-support-the-next-action',
      title: '검색 결과는 다음 행동을 준비한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 편집할 수 있는 로컬 파일을 읽거나 검색할 때 `[src/file.ts#1A2B]` 같은 스냅샷 머리말과 줄 번호를 붙일 수 있습니다. 태그는 모델이 본 파일 내용에 대응합니다. 이후 `edit`는 이 태그와 노출된 줄 범위를 확인하므로, 검색 결과가 곧 편집의 기준점이 됩니다.',
        },
        {
          kind: 'exchange',
          input: { label: '`grep`이 찾은 한 항목', text: '[src/model.ts#1A2B]\n*84:throw new Error(`Unknown model alias ${alias}`)' },
          outputs: [
            { label: '모델이 읽는 근거', text: '파일 이름, 일치 줄, 주변 문맥을 보고 다음에 읽을 함수 범위를 고릅니다.' },
            { label: '편집기가 확인하는 기준', text: '스냅샷 태그와 모델에게 실제로 보인 줄을 사용해 오래되거나 보지 않은 위치의 수정을 막습니다.' },
            { label: 'UI가 보여 주는 정보', text: '파일별 결과와 잘림 여부를 표시하되, 모델에게 전달되는 원문과 메타데이터를 바꾸지 않습니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`read`는 소스 파일 외에도 디렉터리, 문서, 이미지, 압축 파일, SQLite와 내부 URL을 같은 `path` 입력으로 다룹니다. 각 형식의 해석은 도구가 맡지만, 하네스는 결과의 출처와 변환 방식, 잘림 정보를 유지합니다. 원문을 다시 확인해야 할 때 출처가 없는 요약만 남으면 다음 도구가 같은 대상을 가리킬 수 없습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 읽기 결과와 스냅샷 기록', href: `${source}/docs/tools/read.md` },
            { text: 'OMP · 검색 결과의 해시라인 형식', href: `${source}/docs/tools/grep.md` },
            { text: 'OMP · 세션별 편집 스냅샷 저장소', href: `${source}/packages/coding-agent/src/edit/store.ts` },
          ],
        },
      ],
    },
  ],
};

export const fileEditingTopic: Topic = {
  id: 'file-editing',
  number: '10',
  title: '파일 편집',
  description: '모델이 본 내용에 수정 의도를 고정하고, 검증한 변경을 파일과 세션 기록에 반영하는 도구.',
  sections: [
    {
      id: 'create-or-change',
      title: '새 파일과 기존 파일을 다르게 다룬다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`write`는 새 파일을 만들거나 파일 전체를 주어진 내용으로 바꿉니다. `edit`는 이미 읽은 파일의 특정 줄이나 구문 블록을 대상으로 합니다. 하네스가 두 의도를 다른 도구로 노출하면 모델의 작은 수정이 파일 전체 덮어쓰기로 번지는 일을 줄이고, 승인 화면도 생성과 변경을 구분할 수 있습니다.',
        },
        {
          kind: 'paragraph',
          text: '`edit`의 입력 형식은 선택한 모드에 따라 달라집니다. `replace` 모드는 `path`, `old_string`, `new_string`으로 기존 문자열을 지정하고, 같은 문자열이 여러 번 나오면 더 긴 문맥으로 하나를 고르거나 `replace_all`을 명시하게 합니다. 기본 `hashline` 모드는 읽을 때 받은 태그와 줄 기준점을 사용합니다. 하네스는 활성 모드의 스키마와 안내문, 미리 보기를 함께 바꿔야 모델이 한 형식의 인자를 다른 실행기에 보내지 않습니다.',
        },
        {
          kind: 'execution-path',
          title: '변경 단위에 맞춰 도구를 선택하기',
          input: { label: '작업', text: '기본 요청 제한 시간을 5초에서 10초로 바꾸고 새 회귀 테스트를 추가한다.' },
          labels: { choose: '파일별 편집 방법' },
          paths: [
            {
              label: '기존 `config.ts`',
              stages: [
                { label: '원문 확인', text: '`read`로 상수 선언과 주변 설정을 읽어 스냅샷 태그를 얻습니다.', state: 'complete' },
                { label: '표적 수정', text: '`edit`가 `DEFAULT_TIMEOUT_MS` 선언 한 줄만 10_000으로 바꿉니다.', state: 'complete' },
                { label: '전체 덮어쓰기', text: '나머지 설정을 다시 생성할 필요가 없으므로 `write`는 사용하지 않습니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '주변 코드와 파일 형식을 보존한 작은 diff가 남습니다.' },
            },
            {
              label: '새 `timeout.test.ts`',
              stages: [
                { label: '대상 확인', text: '같은 이름의 파일이 없는지 먼저 확인합니다.', state: 'complete' },
                { label: '전체 내용 생성', text: '`write`가 완전한 테스트 파일을 한 번에 만듭니다.', state: 'complete' },
                { label: '부분 패치', text: '기존 스냅샷이 없는 새 파일이므로 `edit`를 사용하지 않습니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '새 파일의 전체 내용과 생성 사실이 도구 결과에 기록됩니다.' },
            },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · write 도구의 생성·덮어쓰기 계약', href: `${source}/docs/tools/write.md` },
            { text: 'OMP · edit 모드와 입력 계약', href: `${source}/docs/tools/edit.md` },
            { text: 'OMP · 문자열 교체 모드의 일치 검증', href: `${source}/crates/pi-edit/src/modes/replace.rs` },
          ],
        },
      ],
    },
    {
      id: 'anchor-validate-apply',
      title: '본 파일을 기준으로 수정한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 기본 `hashline` 편집 모드는 최근 `read`나 `grep` 결과의 `[PATH#TAG]`를 입력에 요구합니다. 줄 번호는 같은 호출 안에서 앞선 수정으로 이동한 줄이 아니라, 태그가 가리키는 원본 스냅샷을 기준으로 합니다. 모델이 보지 못한 범위나 겹치는 수정, 내용이 달라진 오래된 태그는 적용 전에 검증합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '한 줄 변경이 파일에 적용되기까지',
          prompt: '`config.ts`의 `DEFAULT_TIMEOUT_MS`를 `5_000`에서 `10_000`으로 바꾼다.',
          actors: ['모델', 'OMP 편집기', '파일 시스템'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '기준 읽기', detail: '편집할 상수 주변의 현재 원문을 요청합니다.', correlation: 'edit-7C2A' },
            { from: 1, to: 2, kind: 'read', label: '파일 읽기', detail: '`config.ts`에서 요청한 범위를 읽고 편집 기준 스냅샷을 만듭니다.', correlation: 'edit-7C2A' },
            { from: 2, to: 1, kind: 'result', label: '읽은 스냅샷', detail: '`[src/config.ts#7C2A]`와 모델에게 보인 줄 범위를 기록합니다.', correlation: 'edit-7C2A' },
            { from: 1, to: 0, kind: 'result', label: '기준 원문', detail: '모델이 현재 상수 선언과 편집에 쓸 스냅샷 태그를 받습니다.', correlation: 'edit-7C2A' },
            { from: 0, to: 1, kind: 'call', label: '편집 요청', detail: '`[src/config.ts#7C2A]` 헤더, `PUT 18.=18:`, `+const DEFAULT_TIMEOUT_MS = 10_000;` 본문을 보냅니다.', correlation: 'edit-7C2A' },
            { from: 1, to: 1, kind: 'read', label: '입력 검증', detail: '태그, 노출 범위, 줄 경계, 중복·겹침, 무변경 여부를 확인합니다.', correlation: 'edit-7C2A' },
            { from: 1, to: 1, kind: 'read', label: '변경 준비', detail: '요청한 구간을 원본 스냅샷에 적용하고 diff와 후속 파일 내용을 계산합니다.', correlation: 'edit-7C2A' },
            { from: 1, to: 2, kind: 'call', label: '파일 반영', detail: '준비한 내용을 파일에 기록합니다.', correlation: 'edit-7C2A' },
            { from: 2, to: 1, kind: 'result', label: '기록 완료', detail: '기록된 파일 내용을 반환해 편집기가 실제 diff와 새 스냅샷을 확정합니다.', correlation: 'edit-7C2A' },
            { from: 1, to: 0, kind: 'result', label: '편집 결과', detail: '모델은 실제로 적용된 파일별 결과를 보고 테스트 실행 여부를 결정합니다.', correlation: 'edit-7C2A' },
          ],
        },
        {
          kind: 'paragraph',
          text: '여러 파일을 한 번에 고칠 때 편집기는 모든 섹션의 문법과 기준점을 먼저 준비합니다. 그러나 운영체제 쓰기 오류가 중간에 나면 앞에서 기록한 파일은 이미 바뀌었을 수 있습니다. 하네스는 호출 전체를 한 번의 성공 표시로 뭉개지 말고 파일별 적용 결과와 diff를 남겨야 재시도 범위를 정확히 정할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · hashline 문법과 검증 규칙', href: `${source}/docs/tools/edit.md` },
            { text: 'OMP · 편집 실행과 결과 구성', href: `${source}/packages/coding-agent/src/edit/index.ts` },
            { text: 'OMP · 스냅샷 기반 복구', href: `${source}/crates/pi-edit/src/modes/hashline/recovery.rs` },
          ],
        },
      ],
    },
    {
      id: 'preview-and-mutation-records',
      title: '미리 보기와 적용 결과를 분리한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '모델이 편집 인자를 스트리밍하는 동안 OMP는 완성된 부분만 읽어 쓰지 않는 diff 미리 보기를 만들 수 있습니다. 실행 시점에는 파일을 다시 읽고 같은 검증을 수행합니다. 화면의 미리 보기는 설명용 표시이고, 도구 결과의 실제 diff와 새 스냅샷이 적용 여부를 판단하는 근거입니다.',
        },
        {
          kind: 'exchange',
          input: { label: '검증을 통과한 파일 변경', text: '`src/config.ts` 한 줄 교체\n이전 태그 `7C2A` → 새 태그 `91F0`' },
          outputs: [
            { label: '파일 시스템', text: '새 내용을 기록하고 공유 파일 검색 캐시를 무효화합니다.' },
            { label: '언어 서버', text: '열린 문서 내용을 동기화하고 설정에 따라 포맷과 새 진단을 요청합니다.' },
            { label: '세션', text: 'diff, 첫 변경 줄, 파일별 결과와 새 스냅샷을 다음 도구 호출에 쓸 수 있게 보관합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`write`와 `edit`는 파일 변경 뒤 검색 캐시와 스냅샷을 갱신하며, 연결된 언어 서버가 있으면 포맷과 진단을 같은 쓰기 경계에 묶을 수 있습니다. 따라서 편집 성공 뒤의 검증은 모델이 의도한 문자열이 있었는지만 보는 일이 아닙니다. 하네스는 기록된 diff, 새 파일 버전, 진단, 이후 테스트 결과를 서로 연결해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · hashline diff 미리 보기', href: `${source}/crates/pi-edit/src/modes/hashline/preview.rs` },
            { text: 'OMP · 파일 쓰기와 LSP 연동', href: `${source}/packages/coding-agent/src/lsp/writethrough.ts` },
            { text: 'OMP · 파일 검색 캐시 무효화', href: `${source}/packages/coding-agent/src/tools/fs-cache-invalidation.ts` },
          ],
        },
      ],
    },
  ],
};

export const shellExecutionTopic: Topic = {
  id: 'shell-execution',
  number: '11',
  title: '셸 실행',
  description: '명령의 작업 디렉터리와 환경, 종료 상태, 출력, 취소를 하나의 실행 결과로 관리하는 도구.',
  sections: [
    {
      id: 'command-to-result',
      title: '명령 문자열 밖의 실행 조건도 함께 정한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '같은 명령도 어느 디렉터리에서 어떤 환경 변수로 실행했는지에 따라 결과가 달라집니다. OMP의 `bash` 호출은 `command`와 별도로 `cwd`, `env`, `timeout`, `pty`, `async`를 받습니다. 하네스는 이 값을 구조화해 승인과 기록, 재현에 사용합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '테스트 명령을 실행하고 종료 상태를 돌려주기',
          prompt: '`packages/api`에서 제한 시간 회귀 테스트를 실행해 통과 여부를 확인한다.',
          actors: ['모델', 'OMP BashTool', '셸 프로세스'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '구조화된 호출', detail: '`command: "bun test timeout.test.ts"`, `cwd: "packages/api"`, `timeout: 120`을 생성합니다.', correlation: 'bash-test-1' },
            { from: 1, to: 1, kind: 'read', label: '정책과 입력 확인', detail: '명령 승인 규칙, 인터셉터, 환경 변수 이름과 작업 디렉터리를 검사합니다.', correlation: 'bash-test-1' },
            { from: 1, to: 2, kind: 'call', label: '프로세스 시작', detail: '비대화형 환경을 구성하고 선택한 셸 백엔드에 명령을 전달합니다.', correlation: 'bash-test-1' },
            { from: 2, to: 1, kind: 'result', label: '출력과 종료', detail: 'stdout·stderr 스트림, 프로세스의 성공 종료와 실행 시간을 BashTool에 반환합니다.', correlation: 'bash-test-1' },
            { from: 1, to: 0, kind: 'result', label: '도구 결과', detail: '테스트 통과 출력과 성공 결과, 시간 제한·잘림 메타데이터를 다음 모델 요청에 넣습니다.', correlation: 'bash-test-1' },
          ],
        },
        {
          kind: 'paragraph',
          text: '모델은 명령을 제안하고, `BashTool`이 승인을 거쳐 실행 백엔드를 호출합니다. 실제 자식 프로세스를 만드는 주체는 셸 백엔드입니다. OMP는 프로세스의 코드 `0`을 성공 결과로 바꾸지만 모델에게 보여 주는 성공 상세에는 코드를 생략합니다. 0이 아닌 종료에는 코드와 오류 표시가 남으므로, 모델은 테스트 러너의 통과 요약과 도구의 성공 여부를 함께 근거로 삼습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Bash 도구 입력과 실행 분기', href: `${source}/docs/tools/bash.md` },
            { text: 'OMP · Bash 실행기의 전체 흐름', href: `${source}/docs/bash-tool-runtime.md` },
          ],
        },
      ],
    },
    {
      id: 'foreground-and-interactive',
      title: '명령의 상호작용 방식에 맞는 백엔드를 고른다',
      blocks: [
        {
          kind: 'execution-path',
          title: '같은 도구가 서로 다른 실행 표면을 선택한다',
          input: { label: '실행 요구', text: '프로젝트 명령을 실행하고 출력 또는 사용자 입력을 처리한다.' },
          labels: { choose: '실행 방식 선택' },
          paths: [
            {
              label: '비대화형 검사',
              stages: [
                { label: '환경 준비', text: '페이지와 편집기 프롬프트를 끄는 비대화형 기본 환경을 구성합니다.', state: 'complete' },
                { label: '스트림 수집', text: '출력을 계속 받으면서 제한된 미리 보기를 갱신합니다.', state: 'complete' },
                { label: '종료', text: '프로세스의 종료 코드와 실행 시간을 결과에 넣습니다.', state: 'complete' },
              ],
              result: { label: '적합한 작업', text: '테스트, 빌드, 포맷처럼 입력 없이 끝나는 명령.' },
            },
            {
              label: '대화형 터미널',
              stages: [
                { label: 'PTY 요청', text: '`pty: true`이고 현재 세션에 UI가 있으면 터미널 오버레이를 엽니다.', state: 'complete' },
                { label: '입력과 크기', text: '키 입력과 터미널 크기 변경을 네이티브 PTY에 전달합니다.', state: 'complete' },
                { label: '종료', text: '사용자가 닫거나 취소하면 PTY 프로세스를 종료하고 수집한 출력을 정리합니다.', state: 'complete' },
              ],
              result: { label: '적합한 작업', text: 'REPL, 선택 메뉴, 터미널 UI처럼 실제 입력이 필요한 명령.' },
            },
            {
              label: '연결된 편집기 터미널',
              stages: [
                { label: '기능 확인', text: '클라이언트가 터미널 생성을 지원하고 `pty`가 꺼져 있는지 확인합니다.', state: 'complete' },
                { label: '원격 실행', text: '클라이언트 터미널에서 명령을 실행하고 현재 출력과 터미널 ID를 받습니다.', state: 'complete' },
                { label: '정리', text: '완료·시간 초과·취소 뒤 터미널 핸들을 해제합니다.', state: 'complete' },
              ],
              result: { label: '적합한 작업', text: 'ACP 같은 연결 클라이언트가 실행 위치를 맡는 명령.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: 'UI가 없는 출력 모드나 RPC 세션에서는 로컬 PTY를 열 수 없습니다. `pty` 요청을 사용할 수 없으면 OMP는 비대화형 실행으로 돌아가고 그 사실을 결과에 덧붙입니다. 하네스는 대화형 입력이 꼭 필요한 명령을 단순히 “실행 중”으로 두지 말고, 선택한 백엔드와 입력 가능 여부를 사용자에게 보여 줘야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · PTY 선택 조건', href: `${source}/packages/coding-agent/src/tools/bash-pty-selection.ts` },
            { text: 'OMP · 비대화형 셸과 PTY 동작', href: `${source}/docs/bash-tool-runtime.md` },
          ],
        },
      ],
    },
    {
      id: 'output-deadlines-and-cancellation',
      title: '출력과 종료 이유를 함께 보존한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP는 모델에게 stdout과 stderr를 합친 텍스트를 보여 주되, 종료 코드와 시간 초과 여부를 구조화된 상세 정보로 남깁니다. 기본 시간 제한은 300초이고 `timeout: 0`은 도구의 기한을 끕니다. 호출을 취소하면 실행기는 자식 프로세스에 취소를 전달하고, 하네스는 정상 종료·0이 아닌 종료·시간 초과·사용자 취소를 구분합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '한 명령의 관찰값', text: '출력 86 KiB · 종료 코드 `1` · 42초 실행' },
          outputs: [
            { label: '모델에게 보이는 본문', text: '앞·뒤 일부와 생략 표식을 포함한 제한된 출력, 실패 종료 안내.' },
            { label: '전체 출력', text: '잘림이 발생하면 원본 스트림을 아티팩트에 저장하고 `artifact://…` 참조를 제공합니다.' },
            { label: '판정 정보', text: '`exitCode`, 실행 시간, 잘림 이유와 표시·전체 바이트 수를 상세 정보에 남깁니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '현재 기본 인라인 출력 창은 50 KiB이며 긴 한 줄도 별도 열 제한을 받습니다. 따라서 마지막 오류 문구만 보고 실행 전체를 요약해서는 안 됩니다. 하네스는 잘림 메타데이터와 전체 출력 참조를 다음 요청에 넣고, 모델이 필요한 구간을 다시 읽도록 해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · OutputSink와 아티팩트 저장', href: `${source}/packages/coding-agent/src/session/streaming-output.ts` },
            { text: 'OMP · 종료 코드·시간 초과 결과 구성', href: `${source}/packages/coding-agent/src/tools/bash.ts` },
            { text: 'OMP · 셸 실행 취소와 세션 재사용', href: `${source}/packages/coding-agent/src/exec/bash-executor.ts` },
          ],
        },
      ],
    },
  ],
};

export const backgroundJobsTopic: Topic = {
  id: 'background-jobs',
  number: '12',
  title: '백그라운드 작업',
  description: '오래 걸리지만 끝이 있는 실행을 맡기고, 다른 작업을 이어 가며 완료 결과를 회수하는 관리자.',
  sections: [
    {
      id: 'submit-and-deliver',
      title: '호출은 먼저 돌아오고 결과는 나중에 도착한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '통합 테스트처럼 몇 분 뒤 끝나는 명령을 앞에서 기다리면 에이전트가 다른 조사를 시작하지 못합니다. 비동기 실행이 켜진 OMP에서 `bash`의 `async: true`는 명령을 세션의 작업 관리자에 등록하고 작업 ID를 즉시 반환합니다. 프로세스는 정해진 기한이나 취소가 올 때까지 계속 실행됩니다.',
        },
        {
          kind: 'tool-sequence',
          title: '통합 테스트를 맡기고 완료 결과를 받기',
          prompt: '`bun run test:integration`을 백그라운드에서 실행하고 그동안 실패한 단위 테스트를 조사한다.',
          actors: ['모델', 'OMP BashTool·작업 관리자', '테스트 프로세스'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`bash` 비동기 호출', detail: '명령, 작업 디렉터리, 기한과 `async: true`를 BashTool에 보냅니다.', correlation: 'job-bg-1' },
            { from: 1, to: 1, kind: 'call', label: '작업 등록', detail: 'BashTool이 호출을 검증한 뒤 작업 관리자에 소유 에이전트와 `bg_1`을 등록합니다.', correlation: 'job-bg-1' },
            { from: 1, to: 2, kind: 'call', label: '프로세스 실행', detail: '작업 `bg_1`이 테스트 프로세스를 시작하고 출력을 계속 수집합니다.', correlation: 'job-bg-1' },
            { from: 1, to: 0, kind: 'result', label: '즉시 반환', detail: '`state: running`, `jobId: bg_1`을 돌려줘 모델이 다른 도구를 호출할 수 있게 합니다.', correlation: 'job-bg-1' },
            { from: 2, to: 1, kind: 'result', label: '테스트 완료', detail: '124개 통과, 성공 종료와 최종 출력이 작업 결과가 됩니다.', correlation: 'job-bg-1' },
            { from: 1, to: 0, kind: 'result', label: '완료 전달', detail: '소유 세션에 완료 결과를 주입하고 같은 작업 ID로 처음 호출과 연결합니다.', correlation: 'job-bg-1' },
          ],
        },
        {
          kind: 'paragraph',
          text: '초기 `bash` 결과는 실행 성공이 아니라 접수 성공을 뜻합니다. 최종 판정은 같은 작업 ID로 도착한 완료 결과의 종료 코드와 출력에서 이루어집니다. 하네스는 최초 도구 호출, 실행 중 갱신, 완료 전달을 하나의 기록으로 연결해야 모델이 “시작됨”을 “통과함”으로 보고하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Bash 백그라운드 시작과 완료 결과', href: `${source}/docs/tools/bash.md` },
            { text: 'OMP · 비동기 작업 관리자', href: `${source}/packages/coding-agent/src/async/job-manager.ts` },
          ],
        },
      ],
    },
    {
      id: 'wait-inspect-cancel',
      title: '소유한 작업을 기다리고 조회하고 취소한다',
      blocks: [
        {
          kind: 'execution-path',
          title: '실행 중인 작업을 다루는 세 가지 방법',
          input: { label: '현재 상태', text: '에이전트가 소유한 `bg_1`은 실행 중이고 다른 조사는 끝났다.' },
          labels: { choose: '다음 행동 선택' },
          paths: [
            {
              label: '다른 일을 계속한다',
              stages: [
                { label: '전달 유지', text: '작업 관리자가 완료 결과를 소유 세션에 자동으로 보낼 준비를 유지합니다.', state: 'complete' },
                { label: '모델 작업', text: '모델은 파일 조사나 편집을 이어 갑니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '완료되면 새 결과가 대화에 들어와 다음 턴을 깨웁니다.' },
            },
            {
              label: '`hub wait`로 기다린다',
              stages: [
                { label: '관찰 등록', text: '`ids: ["bg_1"]`로 소유 범위 안의 작업을 지켜봅니다.', state: 'complete' },
                { label: '진행 표시', text: '대기 중에는 최신 실행 시간과 출력 꼬리를 갱신합니다.', state: 'complete' },
                { label: '완료 확인', text: '작업이 끝나거나 대기 창이 닫히면 현재 스냅샷을 반환합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '완료 결과를 회수하면 중복 자동 전달을 확인 처리합니다.' },
            },
            {
              label: '취소한다',
              stages: [
                { label: '대상 확인', text: '`hub cancel`에 정확한 작업 ID를 지정합니다.', state: 'complete' },
                { label: '취소 전달', text: '관리자가 작업의 중단 신호를 테스트 프로세스에 전달합니다.', state: 'complete' },
                { label: '종료 기록', text: '작업을 취소 상태로 끝내고 이미 모은 출력을 보존합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '후속 모델 요청은 취소와 테스트 실패를 구분할 수 있습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '`hub`의 작업 조회와 대기는 호출한 에이전트가 소유한 작업을 기준으로 합니다. 명시한 ID가 보이지 않으면 무한히 기다리지 않고 일치하는 작업이 없다고 반환합니다. 완료 작업은 일정 시간 보존되므로, 하네스는 자동 전달을 놓친 화면도 작업 목록에서 최종 결과를 다시 확인할 수 있게 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · hub 작업 조회·대기·취소', href: `${source}/docs/tools/hub.md` },
            { text: 'OMP · 작업 소유권과 완료 전달 구현', href: `${source}/packages/coding-agent/src/tools/hub/jobs.ts` },
          ],
        },
      ],
    },
    {
      id: 'finite-work-boundary',
      title: '끝나는 작업과 계속 살아 있는 서비스를 구분한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '백그라운드 작업에는 완료 결과가 있습니다. 테스트, 빌드, 대용량 분석처럼 끝났을 때 한 번 판정할 실행에 적합합니다. 개발 서버나 디버거처럼 준비된 뒤 계속 살아 있어야 하는 프로그램은 다음 장의 프로세스 관리자가 맡습니다. 그 관리자는 준비 조건, 안정된 이름, 로그 커서와 재시작 정책을 별도로 보존합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '실행할 일', text: '`bun run build` 또는 `bun run dev`' },
          outputs: [
            { label: '백그라운드 작업 · `build`', text: '종료 코드와 산출 로그가 최종 결과입니다. 완료되면 작업이 끝납니다.' },
            { label: '관리 프로세스 · `dev`', text: '포트 준비 뒤에도 실행을 유지합니다. 로그·입력·재시작·종료를 이름으로 제어합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 구분은 모델에게 보여 줄 도구 계약도 바꿉니다. 유한 작업은 작업 ID와 완료 Promise가 핵심이고, 서비스는 현재 생존 여부와 준비 상태가 핵심입니다. 하네스가 둘을 같은 “백그라운드 실행”으로 합치면 정상적으로 오래 사는 서버를 미완료 작업으로 오해하거나, 이미 끝난 빌드를 재시작할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 작업과 프로세스를 함께 조정하는 hub', href: `${source}/docs/tools/hub.md` },
            { text: 'OMP · Bash 자동 백그라운드 처리', href: `${source}/docs/bash-tool-runtime.md` },
          ],
        },
      ],
    },
  ],
};

export const managedProcessesTopic: Topic = {
  id: 'managed-processes',
  number: '13',
  title: '프로세스 관리',
  description: '개발 서버처럼 오래 사는 프로그램의 준비 상태와 로그, 입력, 재시작, 종료를 이름으로 관리하는 구성 요소.',
  sections: [
    {
      id: 'start-and-readiness',
      title: '프로세스 시작과 서비스 준비를 구분한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '개발 서버는 프로세스가 생성된 순간부터 요청을 받을 수 있는 것이 아닙니다. 설정을 읽고 번들러를 시작한 뒤 포트를 열어야 합니다. OMP의 프로세스 관리자는 프로그램과 인자를 셸 문자열이 아닌 별도 필드로 받고, 로그 정규식과 TCP 포트로 준비 상태를 확인합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '개발 서버가 준비된 뒤 브라우저 검사를 시작하기',
          prompt: '`web`이라는 이름으로 개발 서버를 시작하고 로컬 URL 로그와 5173번 포트가 모두 준비될 때까지 기다린다.',
          actors: ['모델', 'OMP 프로세스 브로커', '개발 서버'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`hub start`', detail: '`application: "bun"`, `args: ["run", "dev"]`, `name: "web"`, `ready: { log: "Local: http://localhost:5173", port: 5173, timeout: 30 }`을 전달합니다.', correlation: 'process-web' },
            { from: 1, to: 2, kind: 'call', label: '프로세스 시작', detail: '프로젝트 작업 디렉터리에서 PTY 프로세스를 만들고 로그 수집을 시작합니다.', correlation: 'process-web' },
            { from: 2, to: 1, kind: 'result', label: '로그 조건 충족', detail: '`Local: http://localhost:5173`이 설정한 정규식에 일치합니다.', correlation: 'process-web' },
            { from: 1, to: 2, kind: 'read', label: '포트 확인', detail: '`127.0.0.1:5173`에 연결해 실제 수신 준비를 확인합니다.', correlation: 'process-web' },
            { from: 2, to: 1, kind: 'result', label: '연결 수락', detail: '서버가 5173번 포트의 TCP 연결을 받아 준비 조건을 충족합니다.', correlation: 'process-web' },
            { from: 1, to: 0, kind: 'result', label: '준비 완료', detail: '로그와 포트 조건을 모두 통과한 실행 상태를 반환합니다.', correlation: 'process-web' },
          ],
        },
        {
          kind: 'paragraph',
          text: '로그와 포트를 모두 지정하면 OMP는 두 조건이 모두 맞을 때 준비 완료로 판정합니다. 준비 제한 시간을 넘겨도 프로세스를 임의로 죽이지 않고 실행 중인 상태를 보고합니다. 하네스는 “시작됨”, “준비됨”, “준비 확인 시간 초과”, “종료됨”을 나눠야 후속 도구가 너무 일찍 접속하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · hub 프로세스 시작과 준비 조건', href: `${source}/docs/tools/hub.md` },
            { text: 'OMP · 프로세스 브로커 구현', href: `${source}/packages/coding-agent/src/launch/broker.ts` },
          ],
        },
      ],
    },
    {
      id: 'logs-input-and-restart',
      title: '살아 있는 프로세스를 같은 이름으로 제어한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '관리 프로세스는 호출 하나가 끝난 뒤에도 `web` 같은 안정된 이름으로 남습니다. 모델은 `hub ps`로 상태를 보고, `hub logs`로 출력 일부를 읽고, `hub send`로 표준 입력이나 키·신호를 보낼 수 있습니다. 명령을 다시 조립하는 대신 같은 프로세스를 계속 가리키므로 로그와 입력의 주체가 분명합니다.',
        },
        {
          kind: 'exchange',
          input: { label: '관리 중인 `web`', text: '상태 `ready` · 로그 커서 `1842` · 포트 `5173`' },
          outputs: [
            { label: '새 로그만 보기', text: '`follow: true`, `cursor: 1842`로 출력이 늘어나거나 프로세스가 끝날 때까지 기다립니다.' },
            { label: '입력·신호 보내기', text: '텍스트·Enter·`CTRL_C` 키는 PTY 입력으로 보내고, `signal: "SIGINT"`는 별도의 운영체제 신호로 전달합니다.' },
            { label: '수명 제어', text: '`restart`는 저장한 실행 명세로 다시 시작하고, `stop`은 제한 시간 뒤 종료 상태를 확정합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '로그 결과는 다음에 읽을 위치를 바이트 커서로 돌려줍니다. 하네스가 이 커서를 보존하면 같은 수천 줄을 반복해서 모델 문맥에 넣지 않고 새 오류만 가져올 수 있습니다. 재시작 뒤에는 새 실행을 같은 이름에 연결하면서 이전 출력 로그를 회전해, 현재 실행과 과거 실행을 구분합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 로그 커서, 입력과 신호', href: `${source}/docs/tools/hub.md` },
            { text: 'OMP · 프로세스 제어 클라이언트', href: `${source}/packages/coding-agent/src/launch/client.ts` },
          ],
        },
      ],
    },
    {
      id: 'shared-process-lifecycle',
      title: '프로젝트 안에서 프로세스 소유권을 공유한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OMP의 브로커는 프로젝트별로 프로세스 이름, 실행 명세, 로그와 상태를 보관합니다. 같은 프로젝트에서 연 여러 OMP 인스턴스가 같은 `web`을 조회하고 제어할 수 있습니다. 이미 살아 있는 이름으로 다시 시작하려 하면 새 복제본을 만들지 않고 중지나 재시작을 요구합니다.',
        },
        {
          kind: 'execution-path',
          title: '호스트 세션이 끝날 때의 서비스 수명',
          input: { label: '상황', text: '마지막 OMP 클라이언트가 프로젝트를 닫는다.' },
          labels: { choose: '프로세스 수명 설정' },
          paths: [
            {
              label: '일반 프로세스',
              stages: [
                { label: '클라이언트 해제', text: '브로커가 마지막 프로젝트 클라이언트가 떠났음을 확인합니다.', state: 'complete' },
                { label: '정리', text: '지속 설정이 없는 프로세스를 중지합니다.', state: 'complete' },
                { label: '브로커 종료', text: '관리할 실행이 없으면 브로커도 끝납니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '개발 서버가 세션 수명과 함께 정리됩니다.' },
            },
            {
              label: '`persist: true`',
              stages: [
                { label: '클라이언트 해제', text: '프로젝트 클라이언트가 모두 떠나도 지속 플래그를 확인합니다.', state: 'complete' },
                { label: '프로세스 유지', text: '서비스와 브로커가 계속 살아 있으며 다음 클라이언트가 같은 이름으로 연결합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '명시적으로 수명을 늘린 서비스만 세션 밖에 남습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '재시작 정책은 `no`, `on-failure`, `always` 중 하나이며 실패가 반복되면 제한된 지수 백오프를 사용합니다. 하네스는 자동 재시작 횟수와 현재 PID, 마지막 종료 이유를 표시해야 “서버가 있다”는 이름만으로 건강 상태를 오판하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 프로젝트 공유 수명과 재시작 정책', href: `${source}/docs/tools/hub.md` },
            { text: 'OMP · 브로커 프로토콜과 프로세스 상태', href: `${source}/packages/coding-agent/src/launch/protocol.ts` },
          ],
        },
      ],
    },
  ],
};

export const pythonAndJavaScriptExecutionTopic: Topic = {
  id: 'python-and-javascript-execution',
  number: '14',
  title: 'Python과 JavaScript 실행',
  description: '변수를 유지하는 실행 커널에서 계산을 나누어 수행하고 구조화된 결과와 하네스 도구를 연결하는 런타임.',
  sections: [
    {
      id: 'persistent-cells',
      title: '한 셀의 결과를 다음 셀에서 이어 쓴다',
      blocks: [
        {
          kind: 'paragraph',
          text: '짧은 분석을 매번 새 프로세스로 실행하면 파일을 다시 읽고 데이터를 다시 파싱해야 합니다. OMP의 `eval`은 호출 하나를 셀 하나로 실행하며, Python과 JavaScript가 각각 유지하는 런타임에 변수와 가져온 모듈을 남깁니다. 다음 호출은 같은 언어와 세션 ID를 사용해 앞선 값을 이어 씁니다.',
        },
        {
          kind: 'paragraph',
          text: '아래 두 Python 셀은 요청 네 건의 지연 시간을 한 번만 정의합니다. 첫 셀의 기대 결과는 평균 `210.0`밀리초이고, 둘째 셀은 같은 `durations_ms`에서 200밀리초 이상인 값 `[300, 240]`을 골라야 합니다.',
        },
        {
          kind: 'code',
          language: 'python',
          caption: '첫 번째 `eval` 셀 · 데이터와 평균을 커널에 남긴다',
          code: `durations_ms = [120, 180, 300, 240]
average_ms = sum(durations_ms) / len(durations_ms)
display({"average_ms": average_ms})`,
        },
        {
          kind: 'code',
          language: 'python',
          caption: '두 번째 `eval` 셀 · 앞 셀의 변수를 다시 쓴다',
          code: `slow_requests = [value for value in durations_ms if value >= 200]
display({"slow_requests": slow_requests})`,
        },
        {
          kind: 'tool-sequence',
          title: '호출은 나뉘어도 Python 커널은 이어진다',
          prompt: '평균 지연 시간과 200ms 이상인 요청을 차례로 계산한다.',
          actors: ['모델', 'OMP EvalTool', 'Python 커널'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '첫 셀', detail: '`language: "py"`와 데이터 정의·평균 계산 코드를 보냅니다.', correlation: 'py-session-1' },
            { from: 1, to: 2, kind: 'call', label: '커널 실행', detail: '세션 키에 해당하는 Python 프로세스에서 코드를 실행합니다.', correlation: 'py-session-1' },
            { from: 2, to: 1, kind: 'result', label: '커널 결과', detail: '`display` 값과 실행 완료 상태를 EvalTool로 보냅니다.', correlation: 'py-session-1' },
            { from: 1, to: 0, kind: 'result', label: '구조화된 표시', detail: '`{"average_ms": 210.0}`을 반환하고 변수는 커널에 남습니다.', correlation: 'py-session-1' },
            { from: 0, to: 1, kind: 'call', label: '둘째 셀', detail: '데이터를 다시 정의하지 않고 `durations_ms`를 참조합니다.', correlation: 'py-session-2' },
            { from: 1, to: 2, kind: 'call', label: '같은 커널 실행', detail: '첫 셀의 세션 키로 코드를 보내 남아 있는 변수를 사용합니다.', correlation: 'py-session-2' },
            { from: 2, to: 1, kind: 'result', label: '커널 결과', detail: '필터링한 배열과 실행 완료 상태를 EvalTool로 보냅니다.', correlation: 'py-session-2' },
            { from: 1, to: 0, kind: 'result', label: '필터 결과', detail: '`{"slow_requests": [300, 240]}`을 반환합니다.', correlation: 'py-session-2' },
          ],
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · eval 셀과 유지 런타임 계약', href: `${source}/docs/tools/eval.md` },
            { text: 'OMP · Python 커널 수명과 상태 유지', href: `${source}/docs/python-repl.md` },
          ],
        },
      ],
    },
    {
      id: 'capture-reset-and-cancel',
      title: '출력 채널과 커널 수명을 따로 관리한다',
      blocks: [
        {
          kind: 'exchange',
          input: { label: '실행 중인 셀', text: '계산 코드 · stdout/stderr · `display()` 호출 · 선택한 제한 시간' },
          outputs: [
            { label: '텍스트 스트림', text: '표준 출력과 오류를 실행 중에 갱신하고 최종 텍스트 결과에 합칩니다.' },
            { label: '구조화된 표시', text: 'JSON 값은 트리 데이터로, PNG·JPEG는 이미지 블록으로, Markdown은 서식 있는 결과로 보존합니다.' },
            { label: '실행 메타데이터', text: '언어, 코드, 완료·오류·취소 상태, 실행 시간과 잘림 아티팩트를 셀 결과에 기록합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '셀에서 예외가 나도 예외 전에 만든 변수나 변경은 커널에 남을 수 있습니다. `reset: true`는 선택한 언어의 유지 런타임을 새로 만들고 그다음 셀을 실행합니다. Python을 재설정해도 JavaScript 런타임은 유지되므로, 하네스는 재설정의 대상을 언어별 세션으로 기록해야 합니다.',
        },
        {
          kind: 'paragraph',
          text: '기본 셀 제한 시간은 30초이며 `timeout: 0`은 셀 기한을 끕니다. Python은 취소 때 먼저 인터럽트를 보내고, 정해진 유예 안에 끝나지 않으면 프로세스를 종료해 다음 호출에서 새 커널을 만듭니다. JavaScript도 필요한 경우 워커를 종료합니다. 취소 뒤에는 기존 변수가 남았다고 가정하지 않고 실행 결과의 커널 상태를 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · eval 출력·재설정·취소', href: `${source}/docs/tools/eval.md` },
            { text: 'OMP · Python 인터럽트와 재시작', href: `${source}/docs/python-repl.md` },
            { text: 'OMP · JavaScript 실행 컨텍스트', href: `${source}/packages/coding-agent/src/eval/js/context-manager.ts` },
          ],
        },
      ],
    },
    {
      id: 'tools-inside-code',
      title: '실행 코드에서 하네스 도구를 호출한다',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Eval의 사전 로드는 단순 계산 함수뿐 아니라 `read`, `write`, `tool.<name>(args)`를 제공합니다. 예를 들어 Python 셀이 큰 JSON을 집계하다가 관련 설정 파일이 필요하면 `await tool.read({...})`로 세션의 등록 도구를 호출할 수 있습니다. 이 호출은 현재 작업 디렉터리와 내부 URL, 도구 결과 형식을 그대로 재사용합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '커널 계산과 도구 호출의 경계를 유지하기',
          prompt: '세션 로그를 집계하면서 설정의 `timeout` 선언도 함께 확인한다.',
          actors: ['모델의 Eval 코드', '유지 커널·도구 브리지', '등록된 grep 도구'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '셀 실행', detail: '메모리에 남은 로그 배열을 집계하고 `tool.grep`을 호출합니다.', correlation: 'eval-tool-1' },
            { from: 1, to: 2, kind: 'call', label: '등록 도구 호출', detail: '브리지가 레지스트리에서 현재 `grep` 구현을 찾아 `pattern: "timeout"`, `path: "src"`를 전달합니다.', correlation: 'eval-tool-1' },
            { from: 2, to: 1, kind: 'result', label: '검색 결과', detail: '`grep` 구현이 작업 공간을 검색하고 파일별 일치 줄과 잘림 메타데이터를 커널의 await 결과로 돌려줍니다.', correlation: 'eval-tool-1' },
            { from: 1, to: 0, kind: 'result', label: '결합된 표시', detail: '집계 수치와 검색 근거를 하나의 구조화된 `display()` 값으로 내보냅니다.', correlation: 'eval-tool-1' },
          ],
        },
        {
          kind: 'paragraph',
          text: '브리지가 도구 호출을 다시 하네스로 보내므로, 도구의 승인과 경로 처리, 아티팩트 제한은 일반 호출과 같은 계층에서 적용됩니다. 반면 Eval 코드 자체는 Bun·Node 또는 Python 호스트 기능을 쓸 수 있는 실행 코드입니다. `bash.patterns`는 Eval이 직접 만든 하위 프로세스에는 적용되지 않으므로, 실행 권한을 제한하려는 호스트는 `eval`의 승인 정책도 함께 정해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Eval 사전 로드와 도구 브리지', href: `${source}/docs/tools/eval.md` },
            { text: 'OMP · JavaScript 도구 브리지', href: `${source}/packages/coding-agent/src/eval/js/tool-bridge.ts` },
            { text: 'OMP · Python 도구 브리지', href: `${source}/packages/coding-agent/src/eval/py/tool-bridge.ts` },
          ],
        },
      ],
    },
  ],
};

export const astSearchAndEditingTopic: Topic = {
  id: 'ast-search-and-editing',
  number: '15',
  title: 'AST 검색과 편집',
  description: '문자열이 아니라 구문 트리의 모양으로 코드를 찾고, 캡처한 노드를 보존하며 일괄 변환하는 도구.',
  sections: [
    {
      id: 'text-or-structure',
      title: '같은 글자와 같은 구문을 구분한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`console.log`라는 문자열은 실제 함수 호출뿐 아니라 주석, 문서, 문자열 리터럴에도 나타날 수 있습니다. 호출만 `logger.info`로 바꾸려면 코드의 글자보다 파서가 만든 호출 표현식을 찾아야 합니다. `ast_grep`은 대상 언어로 패턴을 파싱하고 같은 구문 모양의 노드를 반환합니다.',
        },
        {
          kind: 'execution-path',
          title: '로그 호출만 찾는 두 가지 검색',
          input: { label: '주어진 파일', text: '`console.log(user.id)` 호출과 문자열 `"do not replace console.log"`가 함께 있다.' },
          labels: { choose: '검색 기준 선택' },
          paths: [
            {
              label: '`grep` 문자열 검색',
              stages: [
                { label: '정규식 일치', text: '`console\\.log` 글자가 든 모든 줄을 찾습니다.', state: 'complete' },
                { label: '결과 분류', text: '모델이 호출, 주석, 문자열을 원문 문맥으로 다시 구분합니다.', state: 'complete' },
              ],
              result: { label: '관찰 결과', text: '빠르고 폭넓지만 바꿀 코드가 아닌 문자열도 함께 나옵니다.' },
            },
            {
              label: '`ast_grep` 구조 검색',
              stages: [
                { label: '패턴 파싱', text: '`console.log($A)`를 대상 파일 언어의 호출 노드로 파싱합니다.', state: 'complete' },
                { label: '노드 일치', text: '`$A`가 하나의 인자 AST 노드를 캡처하는 호출만 찾습니다.', state: 'complete' },
                { label: '문자열 제외', text: '같은 글자를 포함해도 호출 노드가 아닌 문자열은 일치하지 않습니다.', state: 'skipped' },
              ],
              result: { label: '관찰 결과', text: '변환 대상인 실제 호출과 캡처한 `user.id`를 얻습니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '하네스는 질문이 이름·텍스트에 관한지, 구문 역할에 관한지에 따라 도구를 골라야 합니다. AST 검색 결과에는 파일과 줄뿐 아니라 `$A=user.id` 같은 캡처도 들어가므로, 후속 변환이 무엇을 보존해야 하는지 모델이 확인할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · ast_grep 패턴과 결과', href: `${source}/docs/tools/ast-grep.md` },
            { text: 'OMP · 네이티브 AST 검색 구현', href: `${source}/crates/pi-natives/src/ast.rs` },
          ],
        },
      ],
    },
    {
      id: 'patterns-captures-and-limits',
      title: '패턴은 완전한 구문 노드를 표현한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`$NAME`은 한 노드를 캡처하고, `$_`는 이름 없이 한 노드를 받습니다. `$$$ARGS`는 여러 형제 노드를 캡처합니다. 메타변수 이름은 대문자여야 하며 토큰 일부나 문자열 조각이 아니라 완전한 AST 노드 자리에 놓여야 합니다. 같은 메타변수를 두 번 쓰면 두 위치의 코드도 같아야 합니다.',
        },
        {
          kind: 'code',
          language: 'text',
          caption: '한 노드와 여러 노드를 구분하는 구조 패턴',
          code: `// 인자 하나를 캡처
console.log($VALUE)

// 0개 이상의 인자를 캡처
logger.info($$$ARGS)`,
        },
        {
          kind: 'paragraph',
          text: 'OMP의 네이티브 계층은 파일 확장자로 언어를 추론하고, 지원 언어마다 패턴을 따로 컴파일합니다. JavaScript·TypeScript·Python·Rust·Go·Java·HTML·CSS·JSON·YAML 등 등록된 파서를 사용하며, 대상 언어에서 하나의 노드로 파싱되지 않는 패턴은 해당 언어의 오류로 보고합니다. 구문 오류가 있는 파일도 검색은 시도하지만, 구조 편집에서는 그 파일을 건너뜁니다.',
        },
        {
          kind: 'paragraph',
          text: '`ast_grep`의 기본 표시 한도는 50개 일치이며 디렉터리 검색은 `.gitignore`를 따르고, 패턴이 명시하지 않은 `node_modules`를 건너뜁니다. “일치 없음”과 “일부 파일을 파싱하지 못함”을 같은 결론으로 합치지 않도록 하네스는 검색 수, 결과 제한, 파싱 오류를 함께 반환해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · AST 패턴 문법과 지원 언어', href: `${source}/docs/tools/ast-grep.md` },
            { text: 'OMP · pi-ast 언어 별칭과 확장자 추론', href: `${source}/crates/pi-ast/src/language/mod.rs` },
          ],
        },
      ],
    },
    {
      id: 'preview-and-apply-structural-edits',
      title: '구조 변환은 먼저 제안하고 다시 계산해 적용한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`ast_edit`은 `{ pat, out }` 규칙을 여러 파일에 적용하되 처음에는 파일을 쓰지 않습니다. 예를 들어 `console.log($A)`를 `logger.info($A)`로 바꾸면 캡처한 인자 노드는 그대로 두고 호출의 수신자와 메서드만 바뀝니다. 빈 `out`은 일치 노드를 삭제합니다.',
        },
        {
          kind: 'tool-sequence',
          title: '구조 변환의 제안과 적용을 연결하기',
          prompt: '`src/**/*.ts`의 실제 `console.log` 호출만 `logger.info`로 바꾼다.',
          actors: ['모델', 'OMP ast_edit·write', '네이티브 AST·파일 시스템'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`ast_edit` 미리 보기', detail: '`pat: "console.log($A)"`, `out: "logger.info($A)"`와 대상 파일을 보냅니다.', correlation: 'ast-change-1' },
            { from: 1, to: 2, kind: 'read', label: '네이티브 드라이런', detail: '현재 파일을 읽고 파싱해 겹치지 않는 치환과 변경 전·후 조각을 계산합니다.', correlation: 'ast-change-1' },
            { from: 2, to: 1, kind: 'result', label: '계산된 제안', detail: '파일별 치환 위치·개수와 파싱 오류를 ast_edit에 돌려줍니다.', correlation: 'ast-change-1' },
            { from: 1, to: 0, kind: 'result', label: '변경 제안', detail: '파일 수와 치환 수, 파싱 오류, `xd://resolve`·`xd://reject` 선택지를 반환합니다.', correlation: 'ast-change-1' },
            { from: 0, to: 1, kind: 'call', label: '`write`로 적용 승인', detail: '`path: "xd://resolve"`와 승인 이유를 별도 `write` 도구에 보냅니다.', correlation: 'ast-change-1' },
            { from: 1, to: 2, kind: 'call', label: '실시간 재실행', detail: '대기 중인 규칙을 `dryRun: false`로 현재 파일에 다시 실행해 변경을 기록합니다.', correlation: 'ast-change-1' },
            { from: 2, to: 1, kind: 'result', label: '파일 반영 결과', detail: '실제 치환 총계와 파일별 개수, 바뀐 파일을 resolve 처리기로 돌려줍니다.', correlation: 'ast-change-1' },
            { from: 1, to: 1, kind: 'read', label: '적용 검증', detail: '실제 개수를 미리 보기와 대조하고 일치하면 새 스냅샷 태그를 기록합니다.', correlation: 'ast-change-1' },
            { from: 1, to: 0, kind: 'result', label: '적용 결과', detail: '검증한 파일별 반영 결과를 모델에 반환합니다.', correlation: 'ast-change-1' },
          ],
        },
        {
          kind: 'paragraph',
          text: '한 캡처를 문법이 허용하지 않는 여러 형제 노드로 늘릴 수 없으며, 서로 겹치는 치환은 전체 실행을 중단합니다. 미리 보기 뒤 파일이 바뀌어 치환 수가 달라지면 적용 호출은 오류를 반환합니다. 현재 구현은 재계산한 변경을 쓴 뒤 개수를 대조하므로, 하네스는 오류 때도 실제 diff를 다시 읽고 테스트나 LSP 진단으로 파일을 확인해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · ast_edit 미리 보기와 적용 계약', href: `${source}/docs/tools/ast-edit.md` },
            { text: 'OMP · 제안 적용·거부 장치', href: `${source}/packages/coding-agent/src/tools/resolve.ts` },
          ],
        },
      ],
    },
  ],
};

export const languageServersTopic: Topic = {
  id: 'language-servers',
  number: '16',
  title: '언어 서버',
  description: '프로젝트의 언어 의미를 질의하고, 코드 변경과 같은 문서 버전의 진단·이름 변경을 연결하는 LSP 통합.',
  sections: [
    {
      id: 'server-lifecycle-and-routing',
      title: '파일에 맞는 서버를 시작하고 문서를 연다',
      blocks: [
        {
          kind: 'paragraph',
          text: '언어 서버 프로토콜(Language Server Protocol, LSP)은 정의 찾기, 참조, 진단, 이름 변경 같은 언어 기능을 공통 메시지로 제공합니다. OMP는 프로젝트의 루트 표식과 설치된 실행 파일, 대상 파일 확장자를 보고 서버를 고릅니다. 첫 요청이 오면 서버 프로세스나 공유 전송에 연결하고 `initialize`를 마친 뒤 파일을 엽니다.',
        },
        {
          kind: 'paragraph',
          text: '예를 들어 모델이 `src/invoice.ts`의 `formatInvoice`가 어디에서 정의되는지 묻는다고 합시다. 기대 결과는 선언 위치와 주변 원문이며, 문자열 검색으로 이름이 같은 문구를 모으는 것이 아닙니다.',
        },
        {
          kind: 'tool-sequence',
          title: '심볼 위치를 언어 서버에 질의하기',
          prompt: '`src/invoice.ts` 42번째 줄의 `formatInvoice` 정의를 찾아라.',
          actors: ['모델', 'OMP LSP 클라이언트', '언어 서버'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`definition` 요청', detail: '파일, 1부터 시작하는 줄 번호, 심볼 이름과 제한 시간을 보냅니다.', correlation: 'lsp-def-1' },
            { from: 1, to: 1, kind: 'read', label: '서버 선택', detail: '설정과 파일 형식에 맞는 주 언어 서버를 고르고 기존 연결을 조회합니다.', correlation: 'lsp-def-1' },
            { from: 1, to: 2, kind: 'call', label: '초기화', detail: '필요하면 서버를 시작하고 `initialize`·`initialized` 교환을 완료합니다.', correlation: 'lsp-def-1' },
            { from: 2, to: 1, kind: 'result', label: '서버 준비', detail: '지원 기능과 초기화 완료 상태를 LSP 클라이언트에 돌려줍니다.', correlation: 'lsp-def-1' },
            { from: 1, to: 2, kind: 'call', label: '문서와 위치 전달', detail: '현재 파일 내용을 열고 `textDocument/definition`에 심볼 열 위치를 보냅니다.', correlation: 'lsp-def-1' },
            { from: 2, to: 1, kind: 'result', label: '정의 위치', detail: '`src/formatters/invoice.ts:18:1` 위치를 LSP 응답으로 반환합니다.', correlation: 'lsp-def-1' },
            { from: 1, to: 0, kind: 'result', label: '읽을 수 있는 결과', detail: '정의 위치와 위·아래 원문 한 줄을 모델의 다음 요청에 넣습니다.', correlation: 'lsp-def-1' },
          ],
        },
        {
          kind: 'paragraph',
          text: '기본 설정은 흔한 언어 서버 정의를 포함합니다. 별도 서버 설정이 없을 때 OMP는 현재 작업 디렉터리의 루트 표식과 실행 파일을 함께 확인합니다. 설정을 바꾼 뒤에는 작업 공간 `reload`가 캐시를 비우고 서버 목록을 다시 만들며, 일반 요청은 같은 프로젝트의 기존 클라이언트를 재사용합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · LSP 도구의 라우팅과 클라이언트 수명', href: `${source}/docs/tools/lsp.md` },
            { text: 'OMP · 언어 서버 자동 탐지와 설정 우선순위', href: `${source}/docs/lsp-config.md` },
            { text: 'OMP · LSP 클라이언트와 JSON-RPC', href: `${source}/packages/coding-agent/src/lsp/client.ts` },
          ],
        },
      ],
    },
    {
      id: 'navigation-refactoring-and-actions',
      title: '질의와 코드 변경의 경계를 드러낸다',
      blocks: [
        {
          kind: 'execution-path',
          title: 'LSP 요청이 읽기인지 변경인지 구분하기',
          input: { label: '대상 심볼', text: '`formatInvoice`가 선언되고 호출되는 TypeScript 프로젝트.' },
          labels: { choose: 'LSP 행동 선택' },
          paths: [
            {
              label: '조사',
              stages: [
                { label: '심볼 질의', text: '`definition`, `references`, `hover`, `symbols`가 위치와 타입 정보를 요청합니다.', state: 'complete' },
                { label: '원문 연결', text: 'OMP가 반환 위치에 주변 코드를 붙여 모델이 쓰임을 비교하게 합니다.', state: 'complete' },
                { label: '파일 변경', text: '읽기 행동이므로 작업 공간은 바꾸지 않습니다.', state: 'skipped' },
              ],
              result: { label: '결과', text: '선언과 호출 위치를 근거로 수정 범위를 정합니다.' },
            },
            {
              label: '이름 변경',
              stages: [
                { label: '변경 계산', text: '`rename`이 서버에서 여러 파일의 `WorkspaceEdit`를 받습니다.', state: 'complete' },
                { label: '미리 보기', text: '`apply: false`이면 파일별 변경을 보여 주고 쓰지 않습니다.', state: 'complete' },
                { label: '적용', text: '승인한 호출은 한 스냅샷을 기준으로 편집을 적용하고 서버 문서를 갱신합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '문자열 치환 대신 언어 서버가 계산한 참조 집합을 함께 바꿉니다.' },
            },
            {
              label: '코드 액션',
              stages: [
                { label: '목록 요청', text: '현재 위치와 진단을 바탕으로 가능한 수정 제목과 종류를 받습니다.', state: 'complete' },
                { label: '선택', text: '제목 일부나 번호로 하나를 골라 적용 요청을 만듭니다.', state: 'complete' },
                { label: '서버 명령', text: '액션의 편집을 적용하고 필요한 서버 명령을 실행합니다.', state: 'complete' },
              ],
              result: { label: '결과', text: '어떤 액션을 선택했는지와 실제 파일 변경을 함께 기록합니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '`rename`, `rename_file`, 코드 액션은 파일을 바꿀 수 있으므로 OMP는 읽기 질의와 다른 승인 등급을 사용합니다. 미리 보기와 적용 결과를 같은 메시지로 취급하지 말고, 하네스는 서버가 제안한 편집과 실제 기록된 파일 diff를 연결해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 정의·참조·이름 변경·코드 액션', href: `${source}/docs/tools/lsp.md` },
            { text: 'OMP · WorkspaceEdit 적용', href: `${source}/packages/coding-agent/src/lsp/edits.ts` },
          ],
        },
      ],
    },
    {
      id: 'versioned-diagnostics',
      title: '진단을 해당 파일 버전과 연결한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '언어 서버는 문서를 받은 뒤 비동기로 진단을 보냅니다. 파일을 연속해서 고치면 첫 번째 내용에 대한 오류가 두 번째 편집 뒤에 도착할 수 있습니다. OMP의 쓰기 연동은 편집 전에 서버별 진단 스트림 버전을 기록하고, 새 문서를 동기화한 뒤 기대 문서 버전을 캡처해 그 편집보다 새로운 진단을 기다립니다.',
        },
        {
          kind: 'exchange',
          input: { label: '파일 변경', text: '`invoice.ts` 문서 버전 17 → 18\n`total`을 `string`에서 `number`로 수정' },
          outputs: [
            { label: '늦게 온 이전 진단', text: '버전 17의 `number` 할당 오류는 새 편집의 결과로 채택하지 않습니다.' },
            { label: '새 진단', text: '버전 18을 본 서버의 발행을 기다려 `OK` 또는 현재 오류 목록을 연결합니다.' },
            { label: '느린 서버', text: '짧은 인라인 대기 안에 결과가 없으면 파일 쓰기는 먼저 반환하고, 신선한 진단을 나중에 별도 전달합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: 'OMP의 진단 장부는 이미 보여 준 같은 오류를 다시 줄이고, 해결되어 목록이 비면 해당 파일 기록도 비웁니다. 하네스는 진단이 없다는 결과도 검증 근거로 보존해야 하며, 늦은 진단에는 어떤 편집 뒤에 수집했는지 표시해야 모델이 과거 오류를 다시 고치지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 쓰기 뒤 신선한 진단 대기', href: `${source}/packages/coding-agent/src/lsp/writethrough.ts` },
            { text: 'OMP · 진단 버전 판정', href: `${source}/packages/coding-agent/src/lsp/diagnostics.ts` },
            { text: 'OMP · 반복 진단 장부', href: `${source}/packages/coding-agent/src/lsp/diagnostics-ledger.ts` },
          ],
        },
      ],
    },
  ],
};

export const debuggersTopic: Topic = {
  id: 'debuggers',
  number: '17',
  title: '디버거',
  description: '실행 중인 프로그램을 멈추고 호출 스택과 변수 값을 관찰해 실패 원인을 코드 위치에 연결하는 DAP 통합.',
  sections: [
    {
      id: 'trace-a-failing-program',
      title: '실패한 출력에서 실행 중 값으로 들어간다',
      blocks: [
        {
          kind: 'paragraph',
          text: '웹 서비스의 `/total`에 `{ price: 12000, quantity: 2 }`를 보내면 `24000`이 나와야 하지만 실제 응답은 `null`이라고 합시다. 구현은 `item.price * item.qty`를 더합니다. JSON에서 `NaN`이 `null`로 직렬화되기 때문에 출력만 보면 어느 필드가 잘못됐는지 바로 드러나지 않습니다.',
        },
        {
          kind: 'tool-sequence',
          title: '실행 중인 요청을 중단하고 잘못된 필드를 확인하기',
          prompt: '실행 중인 개발 서버에 붙어 `/total` 계산 줄의 변수 값을 확인한다.',
          actors: ['모델', 'OMP DAP·실행 도구', '디버그 어댑터·서비스'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`attach`', detail: '실행 중인 서버 PID와 JavaScript 디버그 어댑터를 지정합니다.', correlation: 'debug-total-1' },
            { from: 1, to: 2, kind: 'call', label: 'DAP 연결', detail: '어댑터를 시작하고 `initialize`·`attach`·`configurationDone` 교환을 완료합니다.', correlation: 'debug-total-1' },
            { from: 2, to: 1, kind: 'result', label: '연결 완료', detail: '어댑터 기능과 실행 중인 대상 세션 정보를 DAP 런타임에 반환합니다.', correlation: 'debug-total-1' },
            { from: 1, to: 0, kind: 'result', label: '세션 준비', detail: '모델이 중단점을 설정할 수 있는 디버그 세션 ID를 받습니다.', correlation: 'debug-total-1' },
            { from: 0, to: 1, kind: 'call', label: '중단점 설정', detail: '`checkout.js`의 `price * qty` 계산 줄에 소스 중단점을 둡니다.', correlation: 'debug-total-1' },
            { from: 1, to: 2, kind: 'call', label: '중단점 전달', detail: '원하는 중단점 집합을 어댑터와 대상 프로그램에 동기화합니다.', correlation: 'debug-total-1' },
            { from: 2, to: 1, kind: 'result', label: '중단점 확인', detail: '어댑터가 확인한 소스 위치와 중단점 ID를 반환합니다.', correlation: 'debug-total-1' },
            { from: 1, to: 0, kind: 'result', label: '재현 준비', detail: '모델이 중단점이 활성화된 것을 확인합니다.', correlation: 'debug-total-1' },
            { from: 0, to: 1, kind: 'call', label: '`/total` 재현', detail: '실행 도구에 `{ price: 12000, quantity: 2 }` HTTP 요청을 보냅니다.', correlation: 'debug-total-1' },
            { from: 1, to: 2, kind: 'call', label: 'HTTP 요청 전달', detail: '실행 도구가 개발 서버의 `/total` 엔드포인트를 호출합니다.', correlation: 'debug-total-1' },
            { from: 2, to: 1, kind: 'result', label: '중지 이벤트', detail: '요청 처리가 계산 줄에서 멈추고 어댑터가 스레드·프레임 위치를 보고합니다.', correlation: 'debug-total-1' },
            { from: 1, to: 0, kind: 'result', label: '중지 통지', detail: '모델이 멈춘 소스 위치와 조사에 사용할 세션·스레드 정보를 받습니다.', correlation: 'debug-total-1' },
            { from: 0, to: 1, kind: 'call', label: '`stack_trace`', detail: '중지된 스레드의 호출 프레임을 요청합니다.', correlation: 'debug-stack' },
            { from: 1, to: 2, kind: 'call', label: '스택 질의', detail: '저장된 스레드 ID를 어댑터에 전달합니다.', correlation: 'debug-stack' },
            { from: 2, to: 1, kind: 'result', label: '프레임 목록', detail: '`checkout.js:27`의 프레임 ID `18`을 반환합니다.', correlation: 'debug-stack' },
            { from: 1, to: 0, kind: 'result', label: '호출 스택', detail: '모델이 조사할 프레임 ID와 호출 순서를 받습니다.', correlation: 'debug-stack' },
            { from: 0, to: 1, kind: 'call', label: '`scopes`', detail: '프레임 `18`의 지역 범위를 요청합니다.', correlation: 'debug-scopes' },
            { from: 1, to: 2, kind: 'call', label: '범위 질의', detail: '프레임 ID를 어댑터에 전달합니다.', correlation: 'debug-scopes' },
            { from: 2, to: 1, kind: 'result', label: '지역 범위', detail: '지역 변수 범위와 그 `variablesReference`를 반환합니다.', correlation: 'debug-scopes' },
            { from: 1, to: 0, kind: 'result', label: '범위 참조', detail: '모델이 다음 `variables` 호출에 쓸 `scope_id`를 받습니다.', correlation: 'debug-scopes' },
            { from: 0, to: 1, kind: 'call', label: '`variables`', detail: '앞 단계의 `scope_id`로 지역 변수 값을 요청합니다.', correlation: 'debug-vars' },
            { from: 1, to: 2, kind: 'call', label: '변수 질의', detail: '범위의 변수 참조를 어댑터에 전달합니다.', correlation: 'debug-vars' },
            { from: 2, to: 1, kind: 'result', label: '변수 값', detail: '`item.qty = undefined`, `item.quantity = 2`를 반환합니다.', correlation: 'debug-vars' },
            { from: 1, to: 0, kind: 'result', label: '관찰 결과', detail: '모델이 잘못된 필드와 올바른 입력 필드를 비교합니다.', correlation: 'debug-vars' },
          ],
        },
        {
          kind: 'paragraph',
          text: '이 결과는 수정할 근거를 구체화합니다. 모델은 `qty`를 `quantity`로 바꾸는 편집을 제안하고, 하네스는 파일 편집과 재실행을 별도 도구로 수행합니다. 디버거가 값을 관찰한 것과 편집기가 코드를 바꾼 것, HTTP 검사가 `24000`을 확인한 것을 각각 기록해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · debug 도구와 DAP 행동', href: `${source}/docs/tools/debug.md` },
            { text: 'OMP · DAP 세션과 중지 상태', href: `${source}/packages/coding-agent/src/dap/session.ts` },
          ],
        },
      ],
    },
    {
      id: 'launch-attach-and-adapters',
      title: '프로그램과 디버그 어댑터의 수명을 조립한다',
      blocks: [
        {
          kind: 'execution-path',
          title: '새 실행과 기존 실행에 연결하는 방법',
          input: { label: '조사 대상', text: '재현 가능한 CLI 또는 이미 요청을 받는 개발 서버.' },
          labels: { choose: '디버그 세션 시작 방법' },
          paths: [
            {
              label: '`launch`',
              stages: [
                { label: '어댑터 선택', text: '파일 확장자, 프로젝트 루트 표식과 설치된 실행 파일로 어댑터를 고릅니다.', state: 'complete' },
                { label: '프로그램 시작', text: '프로그램·인자·작업 디렉터리를 launch 요청으로 전달합니다.', state: 'complete' },
                { label: '세션 준비', text: '초기 중지 이벤트가 있으면 위치를 저장하고, 없으면 실행 중인 세션으로 반환합니다.', state: 'complete' },
              ],
              result: { label: '적합한 대상', text: '같은 입력으로 새로 실행해 재현할 수 있는 테스트나 CLI.' },
            },
            {
              label: '`attach`',
              stages: [
                { label: '대상 지정', text: 'PID 또는 호스트·포트와 어댑터를 고릅니다.', state: 'complete' },
                { label: '실행 유지', text: '이미 살아 있는 프로그램에 디버그 세션만 연결합니다.', state: 'complete' },
                { label: '중단점 동기화', text: '연결 뒤 설정한 소스·함수 중단점을 대상에 보냅니다.', state: 'complete' },
              ],
              result: { label: '적합한 대상', text: '준비 비용이 크거나 외부 요청으로 재현해야 하는 서버.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: 'OMP는 GDB, LLDB, debugpy, Delve, JavaScript 디버거 등 설치된 어댑터를 설정으로 해석합니다. 한 번에 하나의 루트 디버그 세션 트리를 유지하며, 어댑터의 `startDebugging` 요청으로 생긴 자식 세션은 같은 트리에 연결합니다. 다른 루트를 시작하려면 현재 세션을 먼저 종료해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 어댑터 선택과 전송 방식', href: `${source}/docs/tools/debug.md` },
            { text: 'OMP · DAP 기본 어댑터 설정', href: `${source}/packages/coding-agent/src/dap/defaults.json` },
            { text: 'OMP · DAP 클라이언트 전송', href: `${source}/packages/coding-agent/src/dap/client.ts` },
          ],
        },
      ],
    },
    {
      id: 'stopped-state-and-inspection',
      title: '중지된 프레임을 다음 질의의 기준으로 삼는다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`stopped` 이벤트가 오면 OMP는 활성 자식 세션, 스레드, 프레임과 명령 포인터를 저장합니다. `scopes`와 `evaluate`는 `frame_id`를 생략하면 이 현재 프레임을 사용합니다. `variables`에는 앞선 `scopes` 결과의 `variable_ref`나 `scope_id`가 반드시 필요합니다. 프로그램이 다시 실행되면 다음 중지 이벤트에서 스택과 범위 참조를 새로 얻습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '현재 중지 위치', text: '`checkout.js:27` · thread `3` · frame `18`' },
          outputs: [
            { label: '실행 제어', text: '`continue`, `step_over`, `step_in`, `step_out`이 먼저 다음 중지·종료 이벤트 대기를 등록한 뒤 실행을 재개합니다.' },
            { label: '프레임 조사', text: '`stack_trace`가 호출 순서를, `scopes`가 지역·전역 범위를, `variables`가 참조된 값을 가져옵니다.' },
            { label: '표현식 확인', text: '`evaluate`가 선택한 프레임에서 `item.price * item.quantity` 같은 식을 계산합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '메모리 읽기, 디스어셈블, 데이터 중단점 같은 행동은 어댑터가 해당 DAP 기능을 광고했을 때만 실행합니다. `terminate`는 루트와 자식 세션을 함께 정리합니다. 하네스는 어댑터 기능 부족, 실행 중 대기 시간 초과, 대상 프로그램 종료를 서로 다른 결과로 남겨야 다음 행동을 선택할 수 있습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 중지 프레임과 변수 조사', href: `${source}/docs/tools/debug.md` },
            { text: 'OMP · DAP 타입과 기능 플래그', href: `${source}/packages/coding-agent/src/dap/types.ts` },
          ],
        },
      ],
    },
  ],
};

export const webSearchAndDocumentRetrievalTopic: Topic = {
  id: 'web-search-and-document-retrieval',
  number: '18',
  title: '웹 검색과 문서 가져오기',
  description: '검색 후보에서 원문 URL을 선택하고, 추출한 문서와 출처를 모델의 검증 가능한 근거로 전달하는 도구.',
  sections: [
    {
      id: 'search-then-read',
      title: '검색 결과에서 원문으로 이동한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '웹 검색 결과의 URL과, 제공자가 돌려준 제목·발췌문이 있다면 어떤 문서를 읽을지 고르는 단서가 됩니다. OMP의 `web_search`는 질의를 검색 제공자에 보내 답변, 출처 URL과 선택적인 제목·날짜·발췌문·인용을 공통 형식으로 정리합니다. 모델은 관련성과 권위를 보고 URL을 고른 뒤 `read`로 원문을 가져옵니다.',
        },
        {
          kind: 'paragraph',
          text: '예를 들어 오래 걸리는 셸 명령이 언제 자동으로 백그라운드 작업이 되는지 확인하려고 OMP의 `bash.autoBackground.thresholdMs`를 조사한다고 합시다. 기대 결과는 공식 저장소 문서의 URL과, 이 값이 전경 대기 시간을 정한다는 원문입니다.',
        },
        {
          kind: 'tool-sequence',
          title: '공식 문서 후보 찾기',
          prompt: 'OMP의 `bash.autoBackground.thresholdMs`를 설명하는 공식 문서 URL을 찾는다.',
          actors: ['모델', 'OMP web_search', '검색 제공자'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`web_search` 질의', detail: '설정 키와 `site:github.com/can1357/oh-my-pi` 제한을 포함한 질의를 보냅니다.', correlation: 'web-source-1' },
            { from: 1, to: 2, kind: 'call', label: '검색 요청', detail: '사용 가능한 첫 제공자에 질의와 결과 수·최신성 조건을 전달합니다.', correlation: 'web-source-1' },
            { from: 2, to: 1, kind: 'result', label: '후보 출처', detail: '`docs/bash-tool-runtime.md`의 GitHub URL과 제공 가능한 제목·발췌문이 돌아옵니다.', correlation: 'web-source-1' },
            { from: 1, to: 0, kind: 'result', label: '정규화된 결과', detail: '번호가 붙은 출처 URL, 제공자 답변과 적용하지 못한 제약 안내를 반환합니다.', correlation: 'web-source-1' },
          ],
        },
        {
          kind: 'tool-sequence',
          title: '후보 URL에서 원문 읽기',
          prompt: '찾은 공식 문서에서 설정 키의 실제 동작을 확인한다.',
          actors: ['모델', 'OMP read·fetch', '원문 웹 서버'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '`read` URL 호출', detail: '공식 저장소의 `docs/bash-tool-runtime.md` URL을 선택해 본문을 요청합니다.', correlation: 'web-source-2' },
            { from: 1, to: 2, kind: 'read', label: '페이지 가져오기', detail: '콘텐츠 유형을 확인하고 HTML·Markdown·JSON 등에 맞는 추출기를 적용합니다.', correlation: 'web-source-2' },
            { from: 2, to: 1, kind: 'result', label: '원문 응답', detail: '최종 URL과 콘텐츠 유형, 본문을 반환합니다.', correlation: 'web-source-2' },
            { from: 1, to: 0, kind: 'result', label: '읽을 수 있는 문서', detail: '임계 시간을 넘긴 전경 실행이 관리 작업으로 전환된다는 원문과 출처 URL이 다음 모델 요청에 들어갑니다.', correlation: 'web-source-2' },
          ],
        },
        {
          kind: 'paragraph',
          text: '검색 제공자가 만든 요약과 웹 사이트의 원문은 다른 자료입니다. 하네스는 검색 결과의 제공자·URL과 `read`가 실제로 도달한 최종 URL을 보존해야 합니다. 모델의 답변에는 주장을 뒷받침하는 원문 링크를 연결하고, 검색 발췌문만으로 세부 API 계약을 단정하지 않게 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · web_search 흐름과 결과 형식', href: `${source}/docs/tools/web_search.md` },
            { text: 'OMP · URL 읽기와 콘텐츠 추출', href: `${source}/docs/tools/read.md` },
            { text: 'OMP · Bash 자동 백그라운드 전환', href: `${source}/docs/bash-tool-runtime.md` },
          ],
        },
      ],
    },
    {
      id: 'provider-constraints-and-fallback',
      title: '검색 제공자의 차이를 결과에 남긴다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`site:`, `-site:`, `after:`, `before:`, `filetype:` 같은 질의 지시를 OMP가 한 번 파싱한 뒤 각 제공자가 지원하는 필드나 질의 문법으로 바꿉니다. 최신성이나 결과 수를 서버에 전달하는 제공자도 있고, 받은 결과를 로컬에서 자르는 제공자도 있습니다. 지원하지 않는 조건은 모든 결과를 버리지 않도록 단계별로 완화하고 그 사실을 결과 앞에 표시합니다.',
        },
        {
          kind: 'execution-path',
          title: '한 검색 호출이 끝나는 방식',
          input: { label: '질의', text: '`site:docs.example.dev after:2026-01-01 timeout option`' },
          labels: { choose: '제공자 응답' },
          paths: [
            {
              label: '답변과 출처',
              stages: [
                { label: '검색 실행', text: '제공자가 답변 텍스트와 출처 URL을 함께 반환합니다.', state: 'complete' },
                { label: '제약 확인', text: '도메인과 날짜 조건을 가능한 범위에서 후처리합니다.', state: 'complete' },
                { label: '공통 형식', text: '답변 뒤에 번호가 붙은 출처와 선택적 인용을 배치합니다.', state: 'complete' },
              ],
              result: { label: '다음 행동', text: '가장 관련 있는 공식 URL의 원문을 읽습니다.' },
            },
            {
              label: '출처 목록만',
              stages: [
                { label: '검색 실행', text: '제공자가 제목, URL과 발췌문을 반환합니다.', state: 'complete' },
                { label: '답변 생성', text: '독립 답변이 없으므로 하네스가 내용을 지어내지 않습니다.', state: 'skipped' },
                { label: '공통 형식', text: '출처 목록을 그대로 모델에게 전달합니다.', state: 'complete' },
              ],
              result: { label: '다음 행동', text: '모델이 후보를 비교하고 원문을 읽습니다.' },
            },
            {
              label: '제공자 실패',
              stages: [
                { label: '실패 기록', text: '권한, 제한 시간, 빈 응답 같은 실패 원인을 제공자 이름과 함께 기록합니다.', state: 'complete' },
                { label: '다음 후보', text: '자동 체인의 다음 사용 가능한 제공자를 순서대로 시도합니다.', state: 'complete' },
                { label: '전체 실패', text: '모든 시도가 실패하면 제공자별 원인을 오류 결과로 합칩니다.', state: 'blocked' },
              ],
              result: { label: '다음 행동', text: '질의를 좁히거나 검색 설정·자격 증명을 고칩니다.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '제공자 전환은 순차적으로 이루어지며 첫 번째로 읽을 수 있는 응답에서 멈춥니다. 같은 질의도 제공자와 시점에 따라 다른 후보를 낼 수 있으므로, 하네스는 질의 원문, 적용·완화한 제약, 제공자와 URL을 실행 기록에 남겨 재검증할 수 있게 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 검색 제공자 선택과 순차 대체', href: `${source}/packages/coding-agent/src/web/search/index.ts` },
            { text: 'OMP · 질의 지시 파싱과 제약 적용', href: `${source}/packages/coding-agent/src/web/search/query.ts` },
            { text: 'OMP · 검색 제공자 공통 타입', href: `${source}/packages/coding-agent/src/web/search/types.ts` },
          ],
        },
      ],
    },
    {
      id: 'document-extraction-and-bounds',
      title: '웹 응답을 읽을 수 있는 문서로 제한한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`read`는 URL의 콘텐츠 유형에 따라 JSON, 피드, 일반 텍스트를 직접 처리하고, HTML에서는 공식 Markdown 대체 문서와 콘텐츠 협상, 본문 추출, `llms.txt` 등을 차례로 시도합니다. 결과 머리말에는 요청 URL, 콘텐츠 유형, 실제 추출 방식과 참고 사항이 들어갑니다. PDF나 문서 파일은 변환된 텍스트로 읽을 수 있습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '웹 응답', text: '최종 URL · `text/html` · 1,240줄 문서' },
          outputs: [
            { label: '모델 본문', text: '기본 최대 300줄·50KiB 안의 추출 텍스트와 문서 머리말.' },
            { label: '후속 범위 읽기', text: '캐시된 추출 결과에 `:301-600` 같은 선택자를 적용해 다시 가져오지 않고 다음 구간을 읽습니다.' },
            { label: '전체 자료', text: '잘린 URL 출력은 가능한 경우 아티팩트에 보관하고 전체 내용 참조를 제공합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '페이지를 모델 문맥에 넣는 일과 브라우저를 조작하는 일은 목적이 다릅니다. 공개 문서의 정적 본문은 `read`로 필요한 내용만 추출하면 같은 URL을 다시 확인하기 쉽습니다. 로그인 상태, JavaScript 렌더링 뒤 DOM, 클릭이나 입력이 필요할 때만 다음 장의 브라우저 세션을 사용합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · URL 렌더링 순서와 선택자', href: `${source}/docs/tools/read.md` },
            { text: 'OMP · 웹 페이지 가져오기 구현', href: `${source}/packages/coding-agent/src/tools/fetch.ts` },
            { text: 'OMP · 큰 출력 아티팩트 구조', href: `${source}/docs/blob-artifact-architecture.md` },
          ],
        },
      ],
    },
  ],
};

export const browserAutomationTopic: Topic = {
  id: 'browser-automation',
  number: '19',
  title: '브라우저 자동화',
  description: '이름 붙인 브라우저 탭의 DOM과 화면을 관찰하고, 인증된 세션을 포함한 실제 UI 상호작용을 검증하는 통합.',
  sections: [
    {
      id: 'observe-act-verify',
      title: '관찰한 요소에 행동하고 바뀐 화면을 다시 확인한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '브라우저 자동화에는 현재 페이지라는 살아 있는 상태가 있습니다. OMP의 Eval `browser` 파사드는 이름 붙인 탭을 열거나 재사용하고, DOM·접근성 정보와 스크린샷을 관찰한 뒤 클릭·입력·선택·업로드를 실행합니다. 모델은 행동을 고르고, 브라우저 워커가 실제 탭에 명령을 보냅니다.',
        },
        {
          kind: 'paragraph',
          text: '사용자가 인증된 스테이징 계정의 배송지 변경을 요청했고, 현재 값은 “서울 중구”, 기대값은 “서울 종로구”라고 합시다. 저장 뒤 확인 배너와 다시 읽은 입력값이 모두 기대값을 보여야 작업이 끝납니다.',
        },
        {
          kind: 'tool-sequence',
          title: '인증된 탭에서 값을 바꾸고 결과를 검증하기',
          prompt: '지정한 스테이징 프로필 탭의 배송지를 “서울 종로구”로 저장한다.',
          actors: ['모델', 'OMP 브라우저 파사드', '브라우저 탭'],
          events: [
            { from: 0, to: 1, kind: 'call', label: '탭 열기', detail: '`profile`이라는 이름과 URL 또는 제목에서 고유한 `app.target` 일부 문자열을 지정합니다.', correlation: 'browser-profile' },
            { from: 1, to: 2, kind: 'call', label: '탭 연결', detail: '릴레이 또는 CDP 백엔드에서 대상 탭을 채택하고 전용 워커를 만듭니다.', correlation: 'browser-profile' },
            { from: 2, to: 1, kind: 'result', label: '연결된 탭', detail: '채택한 탭의 실제 URL·제목과 워커 준비 상태를 브라우저 파사드에 반환합니다.', correlation: 'browser-profile' },
            { from: 1, to: 0, kind: 'result', label: '탭 준비', detail: '모델이 URL·제목을 확인한 이름 붙은 탭 핸들을 받습니다.', correlation: 'browser-profile' },
            { from: 0, to: 1, kind: 'call', label: 'DOM 관찰', detail: '`ariaSnapshot`이나 `observe`로 배송지 입력과 저장 버튼의 현재 참조를 요청합니다.', correlation: 'browser-profile' },
            { from: 1, to: 2, kind: 'read', label: '페이지 조사', detail: '현재 DOM과 접근성 트리를 읽어 요소 참조와 값 “서울 중구”를 반환합니다.', correlation: 'browser-profile' },
            { from: 2, to: 1, kind: 'result', label: 'DOM 결과', detail: '현재 요소 참조와 배송지 값을 브라우저 파사드에 반환합니다.', correlation: 'browser-profile' },
            { from: 1, to: 0, kind: 'result', label: '관찰 결과', detail: '모델이 정확한 입력 요소와 저장 버튼을 선택할 수 있는 정보를 받습니다.', correlation: 'browser-profile' },
            { from: 0, to: 1, kind: 'call', label: '입력과 저장', detail: '정확한 입력 요소를 채우고 저장 버튼을 누른 뒤 확인 배너를 기다립니다.', correlation: 'browser-profile' },
            { from: 1, to: 2, kind: 'call', label: '브라우저 동작', detail: '탭 워커가 입력·클릭 이벤트를 실제 페이지에 전달합니다.', correlation: 'browser-profile' },
            { from: 2, to: 1, kind: 'result', label: '페이지 변경', detail: '저장 요청 뒤 DOM이 다시 렌더링되고 “저장되었습니다” 배너가 나타납니다.', correlation: 'browser-profile' },
            { from: 1, to: 2, kind: 'read', label: '다시 관찰', detail: '새 DOM에서 배송지 값이 “서울 종로구”인지 다시 읽습니다.', correlation: 'browser-profile' },
            { from: 2, to: 1, kind: 'result', label: '저장된 값', detail: '새 입력값과 확인 배너의 현재 DOM 상태를 반환합니다.', correlation: 'browser-profile' },
            { from: 1, to: 0, kind: 'result', label: '검증 결과', detail: '확인 배너와 저장된 입력값을 함께 반환합니다.', correlation: 'browser-profile' },
          ],
        },
        {
          kind: 'paragraph',
          text: '페이지 이동이나 재렌더링은 이전 요소 ID와 참조를 무효화할 수 있습니다. 하네스는 관찰과 행동을 가깝게 실행하고, UI가 바뀐 뒤 새 관찰에서 요소를 다시 찾아야 합니다. 클릭 호출의 성공만 기록하지 말고 사용자가 요구한 최종 값과 화면 신호를 확인합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · Browser Eval 파사드와 탭 API', href: `${source}/docs/tools/browser.md` },
            { text: 'OMP · 탭 워커와 요소 핸들', href: `${source}/packages/coding-agent/src/tools/browser/tab-worker.ts` },
          ],
        },
      ],
    },
    {
      id: 'dom-screenshot-and-page-code',
      title: 'DOM, 접근성 트리와 화면을 목적에 맞게 쓴다',
      blocks: [
        {
          kind: 'execution-path',
          title: '무엇을 확인할지에 따라 관찰 수단을 고른다',
          input: { label: '브라우저 상태', text: '결제 화면의 버튼, 시각적 오류 배너, 표의 여러 행을 조사한다.' },
          labels: { choose: '관찰 수단 선택' },
          paths: [
            {
              label: 'DOM·접근성',
              stages: [
                { label: '`observe`·`ariaSnapshot`', text: '역할, 이름, 텍스트와 상호작용 가능한 요소 참조를 얻습니다.', state: 'complete' },
                { label: '요소 행동', text: 'ID·ref 또는 지원되는 CSS·ARIA·text·XPath 선택자로 조작합니다.', state: 'complete' },
              ],
              result: { label: '적합한 질문', text: '어떤 버튼이 있고 어떤 값이 입력됐는가.' },
            },
            {
              label: '스크린샷',
              stages: [
                { label: '화면 캡처', text: '전체 페이지나 특정 요소를 실제 렌더링 해상도로 저장합니다.', state: 'complete' },
                { label: '시각 확인', text: '겹침, 색, 캔버스, 이미지처럼 DOM 텍스트에 없는 결과를 봅니다.', state: 'complete' },
              ],
              result: { label: '적합한 질문', text: '오류 배너가 가려졌거나 레이아웃이 깨졌는가.' },
            },
            {
              label: '페이지 코드',
              stages: [
                { label: '`evaluate`·`tab.run`', text: '한 번의 워커 실행 안에서 DOM 데이터를 배열로 모으거나 네트워크 대기를 행동과 묶습니다.', state: 'complete' },
                { label: '구조화된 반환', text: '문자열로 평탄화하지 않고 객체와 배열 값을 Eval 결과로 돌려줍니다.', state: 'complete' },
              ],
              result: { label: '적합한 질문', text: '표의 모든 행에서 ID와 상태를 안정적으로 추출할 수 있는가.' },
            },
          ],
        },
        {
          kind: 'paragraph',
          text: '`tab.run`은 함수나 코드 문자열을 탭 워커에서 실행하고 구조화된 값을 반환합니다. 한 이름의 탭에는 동시에 하나의 실행만 허용되며, 제한 시간 초과나 취소 뒤 워커가 교체되면 기존 핸들이 무효가 될 수 있습니다. 하네스는 실행을 직렬화하고 다시 관찰할 복구 경로를 제공해야 합니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 직접 탭 도우미와 tab.run', href: `${source}/docs/tools/browser.md` },
            { text: 'OMP · 탭 감독과 실행 직렬화', href: `${source}/packages/coding-agent/src/tools/browser/tab-supervisor.ts` },
          ],
        },
      ],
    },
    {
      id: 'browser-modes-and-relay',
      title: '격리된 탭과 사용자의 로그인 탭을 구분한다',
      blocks: [
        {
          kind: 'paragraph',
          text: '`browser.open`은 프로젝트 공유 헤드리스 Chromium, 지정한 브라우저 실행 파일, 기존 CDP 엔드포인트, Chrome 릴레이, cmux 표면 중 하나를 선택합니다. 헤드리스 탭은 OMP가 만들고 닫지만, CDP나 릴레이로 붙은 탭은 `close`가 연결만 해제하고 사용자의 탭을 닫지 않습니다.',
        },
        {
          kind: 'exchange',
          input: { label: '브라우저 작업의 요구', text: '공개 페이지 검사 또는 이미 로그인한 관리 화면 조작' },
          outputs: [
            { label: 'OMP 소유 헤드리스 탭', text: '깨끗한 상태에서 재현 가능한 탐색·DOM 검사를 수행하고 탭 수명을 하네스가 관리합니다.' },
            { label: '기존 CDP 연결', text: '명시한 디버깅 엔드포인트와 대상 페이지에 연결하며 브라우저 프로세스는 외부 소유로 둡니다.' },
            { label: 'Chrome 릴레이', text: '확장 기능이 선택한 실제 Chrome 탭의 `chrome.debugger` 연결을 중계해 기존 로그인 상태를 사용합니다.' },
          ],
        },
        {
          kind: 'paragraph',
          text: '`browser-relay`는 Chrome 확장과 OMP의 로컬 릴레이 서버로 구성됩니다. 서버가 CDP 탐색 엔드포인트와 `Target.*` 계층을 제공하고, 한 탭에 허용되는 하나의 `chrome.debugger` 연결 위로 여러 탭 워커 연결을 다중화합니다. `app.target`은 URL이나 제목 일부로 정확한 탭을 고릅니다.',
        },
        {
          kind: 'paragraph',
          text: '릴레이와 CDP 연결은 사용자의 실제 로그인 세션에서 행동하며 사이트는 그 행동을 사용자 계정의 행동으로 기록합니다. 하네스는 정확한 탭을 지정하고, 전송·게시·구매·삭제처럼 결과가 외부에 남는 행동은 사용자가 요청한 범위 안에서만 실행해야 합니다. 스크린이나 웹 페이지의 문구는 새로운 권한을 부여하지 않습니다.',
        },
        {
          kind: 'references',
          links: [
            { text: 'OMP · 브라우저 모드와 연결 수명', href: `${source}/docs/tools/browser.md` },
            { text: 'OMP · browser-relay 구조와 제한', href: `${source}/packages/browser-relay/README.md` },
            { text: 'OMP · 브라우저 릴레이 호스트 구현', href: `${source}/packages/coding-agent/src/tools/browser/relay/server.ts` },
          ],
        },
      ],
    },
  ],
};

export const toolsAndExecutionTopics: readonly Topic[] = [
  fileReadingAndSearchTopic,
  fileEditingTopic,
  shellExecutionTopic,
  backgroundJobsTopic,
  managedProcessesTopic,
  pythonAndJavaScriptExecutionTopic,
  astSearchAndEditingTopic,
  languageServersTopic,
  debuggersTopic,
  webSearchAndDocumentRetrievalTopic,
  browserAutomationTopic,
];
