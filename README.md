# SentWatch Platform

## Overordnet Formål
SentWatch er en intelligent sikkerhedsvagtstyringsplatform, der automatiserer planlægning, jobfordeling og overvågning af sikkerhedspersonale. Platformen er bygget til sikkerhedsvirksomheder, eventarrangører og virksomheder, der har brug for en effektiv og skalerbar løsning til vagtstyring.

## Teknisk Stack
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Sprog**: Multi-sprog support (Dansk, Engelsk, Arabisk)

## Nuværende Status

### Implementerede Features ✅
- **Brugergrænseflader**:
  - Login/signup flow
  - Dashboard med KPI'er
  - Vagtplanlægger med drag-and-drop
  - Brugeradministration
  - Rapporteringsværktøjer

- **Funktionalitet**:
  - Autentificering
  - Rollebaseret adgangskontrol
  - Realtidsopdateringer
  - Offline support
  - Flersproget support

- **Integrationer**:
  - PDF generering
  - Kalenderintegration
  - Notifikationssystem

### Under Udvikling 🚧
- Integration med betalingssystem (Stripe)
- SMS/email notifikationer
- Mobile app version
- To-faktor autentificering
- Avanceret søgning

## Installation & Setup
1. Clone repository
2. Installer afhængigheder: `npm install`
3. Opret en `.env` fil baseret på `.env.example`
4. Start udviklings-serveren: `npm run dev`

## Projektplan
| Milepæl | Status | Deadline |
|---|---|---|
| Core funktionalitet | ✅ Færdig | Marts 2025 |
| Stripe-integration | 🔄 I gang | April 2025 |
| Mobile app MVP | ⏳ Planlagt | Maj 2025

## Setup Instructions

1. **Clone the repository**: `git clone https://github.com/AIHMDA/github-adqmka59.git`
2. **Navigate to the project directory**: `cd github-adqmka59`
3. **Install dependencies**: `npm install`
4. **Create a `.env` file**: Use the `.env.example` as a template and add the necessary environment variables.
5. **Start the development server**: `npm run dev`
6. 
6. **Prerequisites**: Ensure you have Node.js and npm installed.
7. **Troubleshooting**: If you encounter issues, check the logs for error messages and consult the documentation.

## Deployment Instructions

1. **Netlify Account**: Create a Netlify account if you don't have one.
2. **Connect Repository**: Link the GitHub repository to Netlify.
3. **Configure Build Settings**: Set the build command to `npm run build` and the publish directory to `build`.
4. **Deploy**: Deploy the application and monitor the deployment process.


## Usage Guidelines

This is a test change.
Once the development server is running, you can access the application at `http://localhost:3000`. The following features are available:

- **Authentication**: Register and log in to access the platform.
- **User Dashboard**: View and manage your account details.
- **Real-time Updates**: Receive real-time updates on platform activities.
- **Reports**: Generate and view reports based on your data.

|
## Contributing Guidelines

We welcome contributions from the community. Please follow these steps:

1. **Fork the repository**: Create a copy of the repository in your GitHub account.
2. **Create a branch**: Use `feature/`, `bugfix/`, or `hotfix/` prefixes for branch names.
3. **Make changes**: Implement your changes and commit them with descriptive messages.
4. **Submit a pull request**: Open a pull request to the main repository for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

