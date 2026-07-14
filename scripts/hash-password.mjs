import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("사용법: node scripts/hash-password.mjs <원하는비밀번호>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// .env 파일은 $ 를 변수 참조로 해석하므로(dotenv-expand), 해시에 포함된 $ 는 이스케이프해야 한다.
// Vercel 환경변수 입력창은 파일을 거치지 않으므로 원본 해시를 그대로 써야 한다.
const escapedHash = hash.replace(/\$/g, "\\$");
console.log("\n[로컬 .env.local 파일용] 아래 줄을 그대로 추가하세요:\n");
console.log(`DASHBOARD_PASSWORD_HASH=${escapedHash}\n`);
console.log("[Vercel 환경변수 입력창용] 값 칸에는 이스케이프 없이 아래 원본을 붙여넣으세요:\n");
console.log(`${hash}\n`);
