📌 Software Kravspecifikation (SRS) – SentWatch
1. Introduktion
1.1 Formål
SentWatch er en intelligent sikkerhedsstyringsplatform, der gør det muligt for sikkerhedsbureauer, virksomheder og selvstændige vagter at administrere vagter, sikkerhedspersonale, jobfordeling, hændelsesrapportering og betalinger effektivt og digitalt.
Hovedformål:
	• Automatisere vagtplanlægning, check-in/out og hændelsesrapportering.
	• Forbedre kommunikationen mellem sikkerhedsbureauer, kunder og vagter.
	• Tilbyde en robust finansiel transaktionsløsning med understøttelse af flere valutaer.
	• Forbedre effektiviteten gennem realtidsopdateringer, GPS-tracking, notifikationer og interaktive dashboards.

2. Systemoversigt & Teknisk Stack
2.1 Omfang
Platformen består af følgende kernekomponenter:
	1. Admin Panel – Administration af kunder, vagter, vagtskemaer, rapporter og betalinger.
	2. Kundeorienteret Website – Til virksomheder, der booker sikkerhedspersonale og administrerer bookinger.
	3. Mobilapp (React Native) – Til sikkerhedsvagter, der modtager jobopgaver, tjekker ind/ud, indsender rapporter og håndterer betalinger.
2.2 Målgruppe og Brugere
	• Sikkerhedsbureauer: Administrerer vagter, betalinger og hændelser.
	• Selvstændige Sikkerhedsvagter: Ansøger om vagter, indsender rapporter og modtager betaling.
	• Virksomhedskunder: Booker sikkerhedspersonale og overvåger deres tjenester.
	• Platformens Administratorer: Overvåger driften og sikrer overholdelse af regler.

2.3 Teknisk Stack & Systemoversigt
	• Applikationer:
		○ Webapplikation: Next.js (Server Components + SSR), Tailwind CSS, TypeScript
		○ Mobilapplikation: React Native til sikkerhedsvagter med offline-mode & synkronisering
	• Backend:
		○ Supabase (PostgreSQL, Auth, Realtime)
	• API'er & Integrationer:
		○ Stripe API – Betalingshåndtering, udbetalinger & valutakonvertering
		○ Google Maps API – GPS-joblokalisering & check-in/out
		○ OneSignal API – Push-notifikationer
		○ Twilio API – SMS-notifikationer
	• CI/CD & Infrastruktur:
		○ Hosting via Vercel (Frontend) & Supabase (Backend)
		○ GitHub Actions CI/CD pipeline til deployment
		○ Automatisk overvågning, logging & backup-system til fejlhåndtering

3.1 Funktionelle Krav
3.1.1 Brugerroller & Rettigheder
	• Administratorer: 
		○ Administrerer brugere (tilføj, rediger, slet).
		○ Overvåger vagtskemaer og rapporter.
		○ Godkender hændelsesrapporter.
		○ Administrerer betalinger og provisionssatser.
		○ Obligatorisk 2FA-login for øget sikkerhed.
	• Sikkerhedsbureauer: 
		○ Onboarder sikkerhedsvagter.
		○ Tildeler og administrerer vagter.
		○ Genererer rapporter.
	• Virksomhedskunder: 
		○ Booker sikkerhedspersonale & overvåger deres tjenester.
		○ Kan vurdere vagter
		○ Viser transaktionshistorik.
		○ Rapporterer hændelser.
	• Sikkerhedsvagter: 
		○ Ansøger om vagter & indsender hændelsesrapporter.
		○ Ser indtjening, anmoder om udbetaling 
		○ Check-in/check-out via GPS/QR-kode.

3.1.2 Admin Panel Funktioner
	• Brugeradministration (CRUD, rollebaseret adgang).
		○ Tilføj, rediger, slet brugere.
		○ Rollebaseret adgangskontrol (RBAC).
	• Hændelsesrapportering (godkendelse, låsning efter verifikation).
		○ Se, godkende eller afvise hændelsesrapporter.
		○ Hændelsesrapporter låses efter godkendelse.
	• Vagtplanlægning (drag-and-drop, realtidssporing).
		○ Drag-and-drop interface til tildeling af vagter.
		○ Realtidssporing af vagter via GPS.
	• Finansiel administration (Stripe-integration, provision, rapporter).
		○ Behandler betalinger via Stripe API.
		○ Håndterer provisionssatser og automatiske udbetalinger via Stripe Connect.
		○ Genererer finansielle rapporter.

3.1.3 Kundeorienteret Website Funktioner
	• Brugergodkendelse (OTP-login, adgangskode reset).
		○ Opret/login med OTP-verifikation.
		○ Gendan adgangskode via email.
	• Booking af sikkerhedspersonale (søgning, teams, betaling).
		○ Søg sikkerhedspersonale efter lokation.
		○ Vælg teams og bekræft bookinger.
		○ Betalingshåndtering via Stripe.
	• Geo-lokation & tracking (Google Maps API, geofencing).
		○ Vis jobsteder via Google Maps API.
		○ Aktiver geofencing for automatisk check-in/check-out af vagter.
	• Beskeder & notifikationer (OneSignal, Twilio).
		○ Push-notifikationer via OneSignal API.
		○ E-mail/SMS notifikationer via Twilio API.
	• Guard Ratings & Feedback (kundeanmeldelser).
		○ Kunder kan rate vagter efter afsluttet job.
		○ Feedback skal være synlig for bureauer og vagter.
	
3.1.4 Mobilapp Funktioner
	• Vagtprofil administration (dokumentupload, arbejdstilladelser).
		○ Upload verifikationsdokumenter.
		○ Administrer arbejdstilladelser.
	• Jobadministration
		○ Se ledige, kommende og afsluttede vagter.
		○ Ansøg eller træk sig fra vagter.
	• GPS & QR-kode Check-in/Check-out (automatisk jobstart).
		○ Vagter kan checke ind via GPS eller QR-kode.
		○ Systemet registrerer lokation & tidspunkt ved check-in/out.
	• Offline support & synkronisering (lagring af skema & jobdetaljer uden internet).
		○ Vagter kan bruge appen uden internet og synkronisere data, når de igen er online.


3.2 Ikke-Funktionelle Krav
3.2.1 Ydeevnekrav
	• API svartid <3 sekunder.
	• 99.9% uptime SLA.
	• Support for 1M+ brugere.
	• Effektiv caching med Redis for hurtigere datahåndtering.
3.2.2 Sikkerhedskrav
	• JWT-baseret autentifikation for sikker API-adgang.
	• Rollebaseret adgangskontrol (RBAC) med Row Level Security (RLS).
	• End-to-end kryptering af finansielle transaktioner.
	• Automatiseret backup & recovery-plan.

4. Security & Compliance
✅ JWT-baseret autentificering for API-sikkerhed.
✅ RBAC & Row Level Security (RLS) i Supabase.
✅ To-faktor-autentificering (2FA) for admins & bureauer.
✅ End-to-end kryptering af finansielle transaktioner.
✅ Automatiseret backup & recovery-plan.
✅ Overholdelse af GDPR & KSA databeskyttelseslove.

5. Performance Requirements
✅ API-responstid <3 sekunder.
✅ 99.9% uptime SLA.
✅ Skalerbarhed til 1M+ brugere.
✅ Caching med Redis for hurtigere datahåndtering.

6. Internationalization
✅ Sprog: Engelsk, Arabisk, Somali.
✅ RTL-layout understøttelse (for Arabisk).
✅ Automatisk sprogdetektion.
✅ Dynamisk valuta-konvertering baseret på land.

7. Infrastructure & Deployment
✅ CI/CD pipeline via GitHub Actions.
✅ Hosting via Vercel (frontend) & Supabase (backend).
✅ Staging-miljø til test før produktion.
✅ Automatiseret backup & logning af systemfejl.

8. Integration Requirements
✅ Stripe API – Betalingshåndtering.
✅ Google Maps API – GPS-jobtracking.
✅ OneSignal API – Push-notifikationer.
✅ Twilio API – SMS-notifikationer.
✅ Supabase API – Backend-administration.

9. Testing Requirements
✅ Unit Testing (Jest + React Testing Library).
✅ Integration Testing (API & databaser).
✅ End-to-End Testing (Cypress).
✅ Performance Testing (k6) & belastningstest.
✅ Sikkerhedstests (rate limiting, OAuth-beskyttelse).

10. Documentation
✅ API-dokumentation (Endpoints, request/response).
✅ Brugermanualer & onboarding guides.
✅ Administratorvejledning til opsætning af systemet.
✅ CI/CD & sikkerhedsprotokoller.

11. Support & Maintenance
✅ Fejlmeldinger & ticket-system via supportpanel.
✅ Automatiske softwareopdateringer & patches.
✅ Planlagte sikkerhedsrevisioner & performance-optimeringer.
✅ 24/7 teknisk support via e-mail & chatbot.![image](https://github.com/user-attachments/assets/91d514a5-bc43-46bf-8bb1-31ac9fc95ea2)

---

This document should be updated as requirements evolve or new features are identified. All major changes should be versioned and communicated to the development team.

