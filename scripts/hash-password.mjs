import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("사용법: node scripts/hash-password.mjs <원하는비밀번호>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\n.env.local 에 아래 줄을 추가하세요:\n");
console.log(`DASHBOARD_PASSWORD_HASH=${hash}\n`);
