
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Calcular entropía de una contraseña
function calculateEntropy(password) {
  // Contar tipos de caracteres
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let charsetSize = 0;
  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSpecial) charsetSize += 32; // caracteres especiales comunes

  // Entropía = log2(charsetSize^passwordLength)
  const entropy = Math.log2(Math.pow(charsetSize, password.length));
  return Math.round(entropy * 100) / 100;
}

// Evaluar fortaleza de la contraseña
function evaluatePasswordStrength(password, entropy) {
  let strength = "Muy débil";
  let score = 0;

  // Verificar longitud
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 20;

  // Verificar tipos de caracteres
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  // Evaluar entropía
  if (entropy >= 50) score += 20;

  // Determinar fortaleza
  if (score >= 90) strength = "Muy fuerte";
  else if (score >= 70) strength = "Fuerte";
  else if (score >= 50) strength = "Moderada";
  else if (score >= 30) strength = "Débil";

  return { strength, score };
}

// Generar contraseña segura
function generateSecurePassword(length = 16) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = lowercase + uppercase + numbers + special;
  let password = "";

  // Asegurar al menos un carácter de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Llenar el resto aleatoriamente
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Mezclar la contraseña
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

// Interfaz interactiva con Claude
async function runPasswordGenerator() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    "\n🔐 Generador de Contraseñas Seguras con Medidor de Entropía"
  );
  console.log("=".repeat(60));
  console.log(
    "Opciones: 1=Generar contraseña, 2=Evaluar contraseña, 3=Chat con Claude, 4=Salir\n"
  );

  const conversationHistory = [];

  const askUser = () => {
    rl.question("¿Qué deseas hacer? (1-4): ", async (choice) => {
      if (choice === "4") {
        console.log("\n¡Adiós! Recuerda usar contraseñas seguras.");
        rl.close();
        return;
      }

      if (choice === "1") {
        rl.question("¿Longitud de contraseña? (por defecto 16): ", (length) => {
          const pwd = generateSecurePassword(parseInt(length) || 16);
          const entropy = calculateEntropy(pwd);
          const { strength, score } = evaluatePasswordStrength(pwd, entropy);

          console.log("\n✅ Contraseña generada:");
          console.log(`   ${pwd}`);
          console.log(`   Entropía: ${entropy} bits`);
          console.log(`   Fortaleza: ${strength} (puntuación: ${score}/100)`);
          console.log(
            "   Longitud: " + pwd.length + " caracteres\n"
          );

          askUser();
        });
      } else if (choice === "2") {
        rl.question("Ingresa la contraseña a evaluar: ", (password) => {
          const entropy = calculateEntropy(password);
          const { strength, score } = evaluatePasswordStrength(
            password,
            entropy
          );

          console.log("\n📊 Evaluación de contraseña:");
          console.log(`   Entropía: ${entropy} bits`);
          console.log(`   Fortaleza: ${strength} (puntuación: ${score}/100)`);
          console.log(`