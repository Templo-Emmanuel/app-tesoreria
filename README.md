# Tesorería · Iglesia Emmanuel

Aplicación web estática (HTML + CSS + JS) con base de datos en **Supabase** y publicación en **Vercel**. No necesita instalar nada ni compilar.

## 1. Supabase (base de datos)
1. Crea una cuenta en https://supabase.com → **New project** (guarda la contraseña de la base).
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y pulsa **Run**.
3. Nueva consulta con `supabase/seed.sql` → **Run** (carga tus datos de enero a agosto de 2026).
4. **Authentication → Providers → Email**: desactiva **Allow new users to sign up**.
5. **Authentication → Users → Add user → Create new user**: escribe tu correo y una contraseña, y marca *Auto Confirm User*. Con esos datos entrarás a la app.
6. **Project Settings → API**: copia **Project URL** y la clave **anon public**.

## 2. Configurar la app
Abre `js/config.js` y reemplaza `url` y `key` con los valores copiados. La clave *anon* es pública por diseño; los datos están protegidos porque solo un usuario con sesión iniciada puede leerlos o escribirlos.

## 3. GitHub
```
git init
git add .
git commit -m "Tesorería Emmanuel"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/tesoreria-emmanuel.git
git push -u origin main
```
(Crea antes el repositorio vacío en github.com. Si prefieres que sea privado, también funciona con Vercel.)

## 4. Vercel
1. https://vercel.com → **Add New → Project** → importa el repositorio.
2. **Framework Preset: Other**. Deja vacíos *Build Command* y *Output Directory*. Pulsa **Deploy**.
3. Abre la dirección que te da Vercel e inicia sesión con el usuario del paso 1.5.

## Uso rápido
Elige el mes arriba → registra en Domingos, Alquiler, Diezmos y Gastos → revisa las alertas en Revisión → anota la caja real → cierra el mes → imprime el informe.

## Ajustes
- Porcentajes (diezmo de ofrenda 10 %, diezmo al Pastor 90 %): `js/config.js`.
- Copias de seguridad: botones **Copia de datos** y **Movimientos (Excel)** en la pantalla principal. Supabase también guarda copias diarias en su plan gratuito durante unos días.
