Copy the contents of .env.example into .env


### Requirements
- Resend API Key (If possible add your domain to send emails to everyone)
- Neon DB postgres connection string

```bash
pnpm i # Install dependencies
pnpm db:migrate # Populate the db with schema
pnpm db:seed # Add inital data
```
