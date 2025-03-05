# SentWatch Platform - Software Requirement Specification (SRS)

## 1. Introduktion

### 1.1 Formål
SentWatch-platformen er designet til at digitalisere og effektivisere administrationen af sikkerhedsarbejdere og deres arbejdsgivere. Systemet muliggør vagtplanlægning, incidentrapportering, lønbehandling og kommunikation mellem sikkerhedsselskaber, individuelle vagter og deres klienter.

### 1.2 Målgruppe
- **Sikkerhedsagenturer:** Små og mellemstore agenturer, der har brug for et digitalt vagtstyringssystem.
- **Individuelle vagter:** Freelance-sikkerhedsarbejdere, der søger fleksible arbejdsopgaver.
- **Virksomheder/klienter:** Eventplanlæggere og ejendomsejere, der har brug for midlertidige sikkerhedstjenester.

### 1.3 Systemoversigt
SentWatch består af følgende komponenter:
- **Admin Panel** til at administrere brugere, vagter, rapporter og finansielle transaktioner.
- **Mobilapplikation** til sikkerhedsvagter og kunder.
- **Kundeorienteret hjemmeside** til jobopslag og interaktion med sikkerhedsudbydere.
- **Backend API** til integration og datahåndtering.

## 2. Overordnede Beskrivelser

### 2.1 Systemets Funktionalitet
- Automatiseret vagtplanlægning med drag-and-drop funktionalitet.
- Incidentrapportering med billed- og tekstinput.
- Betalingshåndtering via Stripe API.
- Realtime push-notifikationer for vigtige opdateringer.
- Brugerroller med tilpassede adgangsniveauer.

### 2.2 Brugergrupper
- **Administratoren:** Administrerer systemet, brugere og rapporter.
- **Kunder:** Booke sikkerhedstjenester og evaluere vagter.
- **Sikkerhedsvagter:** Accepterer vagter, rapporterer hændelser og modtager betalinger.

### 2.3 Begrænsninger
- Systemet skal understøtte flersprog (Engelsk og Arabisk).
- Skal kunne skaleres til flere regioner og valutaer.
- Skal være GDPR- og KSA-compliant i forhold til datasikkerhed.

## 3. Specifikke Krav

### 3.1 Funktionelle Krav

#### Admin Panel
- Opret, rediger og slet brugere.
- Administrere vagter, betalinger og incidentrapporter.
- Filtrere meddelelser efter dato og job.
- Generere automatiserede rapporter.
- **Vagtplanlægning:** Mulighed for at planlægge vagter ved hjælp af en kalender og automatisk optimering.
- **Dashboard:** Visning af aktive vagter, vagter på plads, timer planlagt og andre nøgleinformationer.
- **Brugeradministration:** Håndtering af brugerdokumenter som regerings-ID, sikkerhedslisenser og træningscertifikater.
- **Rapportering:** Mulighed for at skabe og administrere rapporter med filterfunktioner.
- **Login:** Mulighed for login via email samt forskellige tredjeparts platforme som Google, Outlook, Apple og GitHub.
- **Oprette ny vagt:** Mulighed for at indtaste titel, adresse, start- og slutdato/tid, antal vagter, dress code og ekstra kommentarer.
- **Vagtplanlægning og -administration:** Mulighed for at se udelukkede og tildelte vagter, justere vagter og administrere jobsteder.

#### Mobilapplikation
- Push-notifikationer for jobtilbud og betalingsstatus.
- GPS-integration for at vise joblokationer.
- Oprettelse og håndtering af incidentrapporter.
- Wallet-funktion til udbetalinger.

#### Kundeorienteret Website
- Jobopslag og sikkerhedstjenester.
- Betalingsportal til transaktioner.
- Kontaktformular og support.

### 3.2 Ikke-funktionelle Krav
- **Sikkerhed:** To-faktor-autentifikation for administratorer.
- **Skalerbarhed:** Skal understøtte op til 1 million brugere.
- **Performance:** Maksimal responstid på 3 sekunder pr. API-kald.
- **Tilgængelighed:** Web og mobil-app skal fungere offline med begrænsede funktioner.

### 3.3 Brugergrænseflade Krav
- Enkle og intuitive dashboards for alle brugergrupper.
- Responsivt design, kompatibelt med mobile og desktop-enheder.
- Brugertilpassede temaer (lys/mørk tilstand).
- **Indstillinger:** Mulighed for at ændre profilindstillinger, sikkerhed, notifikationer, udseende og sprog.

### 3.4 Integrationer
- **Stripe API:** Håndtering af betalinger.
- **Google Maps API:** Lokationsbaserede tjenester.
- **Twilio API:** SMS/OTP-bekræftelse.

## 4. Use Cases & Brugerrejser

### For Security Agencies
1. Log ind på Admin Panel.
2. Opret en ny jobpost.
3. Alloker sikkerhedsvagter.
4. Generer og se rapporter.
5. Administrer betalinger.

### For Guards
1. Log ind via mobilapp.
2. Se tilgængelige vagter.
3. Accepter vagt og tjek ind.
4. Indsend incidentrapport.
5. Modtag betaling i sin wallet.

### For Clients
1. Opret en konto.
2. Book en sikkerhedsvagt.
3. Overvåg vagtstatus.
4. Modtag rapporter og evaluér vagter.

## 5. Risikoanalyse & Kvalitetssikring

### 5.1 Teststrategier
- **Enhedstest:** Test af individuelle funktioner i systemet.
- **Integrationstest:** Sikre kompatibilitet mellem frontend, backend og API.
- **Brugeraccepttest (UAT):** Involvering af slutbrugere i testfasen.

### 5.2 Sikkerhedsforanstaltninger
- Rollebaseret adgangskontrol.
- Kryptering af brugerdata.
- Automatisk logning af systemhændelser.

### 5.3 Datahåndtering
- GDPR- og KSA-compliance for dataopbevaring.
- Regelmæssig backup af database.
- Sletning af brugerdata efter forespørgsel.

## 6. Konklusion
SentWatch-platformen er designet til at optimere administrationen af sikkerhedsarbejdere og kunder. Med en kombination af automatisering, rapportering og betalingshåndtering skaber systemet en brugervenlig og effektiv oplevelse. Systemet bygges med sikkerhed, skalerbarhed og fleksibilitet i fokus for at understøtte fremtidig vækst og markedsudvidelse.