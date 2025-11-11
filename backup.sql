--
-- PostgreSQL database dump
--

\restrict qFLoB33A73r0sxLZjLgm6NBHBAo01mSDeYftHemix0JFrnLMks9Xcp2d8fZ77Ef

-- Dumped from database version 18.0 (Postgres.app)
-- Dumped by pg_dump version 18.0 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Resource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resource" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "serviceType" text NOT NULL,
    address text,
    city text,
    county text,
    state text DEFAULT 'NJ'::text,
    "zipCode" text,
    phone text,
    email text,
    website text,
    hours text,
    eligibility text,
    "appointmentRequired" boolean DEFAULT false NOT NULL,
    "sourceUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Resource" OWNER TO postgres;

--
-- Name: ResourceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ResourceCategory" (
    "resourceId" integer NOT NULL,
    "categoryId" integer NOT NULL
);


ALTER TABLE public."ResourceCategory" OWNER TO postgres;

--
-- Name: Resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Resource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Resource_id_seq" OWNER TO postgres;

--
-- Name: Resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Resource_id_seq" OWNED BY public."Resource".id;


--
-- Name: ServiceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceCategory" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."ServiceCategory" OWNER TO postgres;

--
-- Name: ServiceCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ServiceCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ServiceCategory_id_seq" OWNER TO postgres;

--
-- Name: ServiceCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ServiceCategory_id_seq" OWNED BY public."ServiceCategory".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Resource id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource" ALTER COLUMN id SET DEFAULT nextval('public."Resource_id_seq"'::regclass);


--
-- Name: ServiceCategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory" ALTER COLUMN id SET DEFAULT nextval('public."ServiceCategory_id_seq"'::regclass);


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resource" (id, name, description, "serviceType", address, city, county, state, "zipCode", phone, email, website, hours, eligibility, "appointmentRequired", "sourceUrl", "createdAt", "updatedAt") FROM stdin;
1	Human Needs Food Pantry of Montclair	Food pantry and clothing center serving Montclair and Essex County.	food_pantry	9 Label Street	Montclair	Essex	NJ	\N	973-746-4669	hnfpdirector@gmail.com	https://www.humanneedsfoodpantry.org	Tue & Thu 12:30–3:00 PM	Open to all residents in need	f	Montclair community listings	2025-11-11 13:43:33.581	2025-11-11 13:43:33.581
2	Human Needs Food Pantry of Montclair	Food pantry and clothing center serving Montclair and Essex County.	food_pantry	9 Label Street	Montclair	Essex	NJ	\N	973-746-4669	hnfpdirector@gmail.com	https://www.humanneedsfoodpantry.org	Tue & Thu 12:30–3:00 PM	Open to all residents in need	f	Montclair community listings	2025-11-11 13:45:51.957	2025-11-11 13:45:51.957
3	Toni's Kitchen (St. Luke's)	Soup kitchen & food ministry providing Meals to-Go and grocery distributions.	soup_kitchen	73 S Fullerton Ave	Montclair	Essex	NJ	\N	973-932-0768	\N	https://toniskitchen.org	Thu–Sat 11:30–12:00; Sun 5:00–5:30 (Meals to-go)	Open to all in need	f	Toni's Kitchen official	2025-11-11 13:45:51.958	2025-11-11 13:45:51.958
4	Salvation Army Montclair Citadel	Emergency shelter, emergency food bags, hot meals, and supportive services.	shelter_food	13 Trinity Place	Montclair	Essex	NJ	\N	973-744-3312	\N	https://easternusa.salvationarmy.org	Emergency food Mon–Fri 9am–4pm; Meals vary	Open to people in need	f	Salvation Army Montclair	2025-11-11 13:45:51.959	2025-11-11 13:45:51.959
5	Cornerstone House (Salvation Army Montclair Citadel Shelter)	23-bed emergency shelter for families and individuals.	shelter	13 Trinity Place	Montclair	Essex	NJ	\N	973-744-3312	\N	\N	Nightly shelter operations; call for intake	People experiencing homelessness	t	Local shelter directory	2025-11-11 13:45:51.96	2025-11-11 13:45:51.96
6	Family Promise of Essex County	Provides emergency shelter and case management for families with children.	shelter	60 South Fullerton Ave, Suite 205	Montclair	Essex	NJ	\N	973-746-1400	info@fpessexnj.org	\N	Mon–Fri 9am–5pm	Families with children facing homelessness	t	https://www.fpessexnj.org	2025-11-11 13:45:51.962	2025-11-11 13:45:51.962
7	Covenant House New Jersey (Nancy's Place, Montclair)	Transitional housing and support for homeless youth (ages 18–21) with mental health needs.	shelter_youth	33 Willow St	Montclair	Essex	NJ	\N	973-744-8175	ajohnson@covenanthouse.org	\N	By referral/intake	Homeless youth 18–21	t	https://www.covenanthouse.org/nancys-place	2025-11-11 13:45:51.963	2025-11-11 13:45:51.963
8	MHA Center for Behavioral Health (Montclair)	Mental health clinic providing therapy, psychiatric evaluation, and support groups.	mental_health_clinic	33 South Fullerton Ave	Montclair	Essex	NJ	\N	973-509-9777	\N	\N	By appointment, sliding scale accepted	Priority to Essex residents; Medicaid/Medicare/uninsured accepted	t	https://www.mhanewjersey.org	2025-11-11 13:45:51.964	2025-11-11 13:45:51.964
9	Essex Recovery Center (Montclair)	Substance use and recovery outpatient services.	health_substance_use	101 Park Street, Suite 3&4	Montclair	Essex	NJ	\N	862-485-8811	\N	\N	Walk-ins for support groups; appointments for treatment	Essex County residents, free or low-cost	f	https://www.essexrecovery.org	2025-11-11 13:45:51.964	2025-11-11 13:45:51.964
10	Oaks Integrated Care (Montclair)	Addiction treatment and psychiatric services.	health_substance_use	104 Bloomfield Ave	Montclair	Essex	NJ	\N	973-783-6655	\N	\N	By appointment, sliding scale/Medicaid accepted	Adults in need of substance abuse recovery	t	https://www.oaksinc.org	2025-11-11 13:45:51.965	2025-11-11 13:45:51.965
11	Montclair Public Library – Social Work Service	Free on-site social work for crises, benefits applications, and referrals.	social_service	50 South Fullerton Ave	Montclair	Essex	NJ	\N	973-744-0500 ext.2286	\N	\N	Tue 4–6:15pm walk-ins, 6:30–7:15pm appt; Thu 12–2pm; 4th Sat 11–12:30 walk-in	Open to all Montclair residents	t	https://www.montclairlibrary.org/services/social-worker	2025-11-11 13:45:51.966	2025-11-11 13:45:51.966
12	Human Needs Food Pantry of Montclair	Food pantry and clothing center serving Montclair and Essex County.	food_pantry	9 Label Street	Montclair	Essex	NJ	\N	973-746-4669	hnfpdirector@gmail.com	https://www.humanneedsfoodpantry.org	Tue & Thu 12:30–3:00 PM	Open to all residents in need	f	Montclair community listings	2025-11-11 14:08:52.727	2025-11-11 14:08:52.727
13	Toni's Kitchen (St. Luke's)	Soup kitchen & food ministry providing Meals to-Go and grocery distributions.	soup_kitchen	73 S Fullerton Ave	Montclair	Essex	NJ	\N	973-932-0768	\N	https://toniskitchen.org	Thu–Sat 11:30–12:00; Sun 5:00–5:30 (Meals to-go)	Open to all in need	f	Toni's Kitchen official	2025-11-11 14:08:52.731	2025-11-11 14:08:52.731
14	Salvation Army Montclair Citadel	Emergency shelter, emergency food bags, hot meals, and supportive services.	shelter_food	13 Trinity Place	Montclair	Essex	NJ	\N	973-744-3312	\N	https://easternusa.salvationarmy.org	Emergency food Mon–Fri 9am–4pm; Meals vary	Open to people in need	f	Salvation Army Montclair	2025-11-11 14:08:52.732	2025-11-11 14:08:52.732
15	Cornerstone House (Salvation Army Montclair Citadel Shelter)	23-bed emergency shelter for families and individuals.	shelter	13 Trinity Place	Montclair	Essex	NJ	\N	973-744-3312	\N	\N	Nightly shelter operations; call for intake	People experiencing homelessness	t	Local shelter directory	2025-11-11 14:08:52.733	2025-11-11 14:08:52.733
16	Family Promise of Essex County	Provides emergency shelter and case management for families with children.	shelter	60 South Fullerton Ave, Suite 205	Montclair	Essex	NJ	\N	973-746-1400	info@fpessexnj.org	\N	Mon–Fri 9am–5pm	Families with children facing homelessness	t	https://www.fpessexnj.org	2025-11-11 14:08:52.734	2025-11-11 14:08:52.734
17	Covenant House New Jersey (Nancy's Place, Montclair)	Transitional housing and support for homeless youth (ages 18–21) with mental health needs.	shelter_youth	33 Willow St	Montclair	Essex	NJ	\N	973-744-8175	ajohnson@covenanthouse.org	\N	By referral/intake	Homeless youth 18–21	t	https://www.covenanthouse.org/nancys-place	2025-11-11 14:08:52.735	2025-11-11 14:08:52.735
18	MHA Center for Behavioral Health (Montclair)	Mental health clinic providing therapy, psychiatric evaluation, and support groups.	mental_health_clinic	33 South Fullerton Ave	Montclair	Essex	NJ	\N	973-509-9777	\N	\N	By appointment, sliding scale accepted	Priority to Essex residents; Medicaid/Medicare/uninsured accepted	t	https://www.mhanewjersey.org	2025-11-11 14:08:52.736	2025-11-11 14:08:52.736
19	Essex Recovery Center (Montclair)	Substance use and recovery outpatient services.	health_substance_use	101 Park Street, Suite 3&4	Montclair	Essex	NJ	\N	862-485-8811	\N	\N	Walk-ins for support groups; appointments for treatment	Essex County residents, free or low-cost	f	https://www.essexrecovery.org	2025-11-11 14:08:52.737	2025-11-11 14:08:52.737
20	Oaks Integrated Care (Montclair)	Addiction treatment and psychiatric services.	health_substance_use	104 Bloomfield Ave	Montclair	Essex	NJ	\N	973-783-6655	\N	\N	By appointment, sliding scale/Medicaid accepted	Adults in need of substance abuse recovery	t	https://www.oaksinc.org	2025-11-11 14:08:52.738	2025-11-11 14:08:52.738
21	Montclair Public Library – Social Work Service	Free on-site social work for crises, benefits applications, and referrals.	social_service	50 South Fullerton Ave	Montclair	Essex	NJ	\N	973-744-0500 ext.2286	\N	\N	Tue 4–6:15pm walk-ins, 6:30–7:15pm appt; Thu 12–2pm; 4th Sat 11–12:30 walk-in	Open to all Montclair residents	t	https://www.montclairlibrary.org/services/social-worker	2025-11-11 14:08:52.739	2025-11-11 14:08:52.739
22	Family Promise of Morris County	Provides shelter and support for homeless families.	shelter	100 South St	Morristown	Morris	NJ	\N	973-285-5000	info@fpmorris.org	\N	Mon–Fri 9am–5pm	Families with children experiencing homelessness	t	https://www.fpmorris.org	2025-11-11 14:08:52.74	2025-11-11 14:08:52.74
23	Community Soup Kitchen (Morristown)	Hot meals for individuals and families in need.	soup_kitchen	55 Madison Ave	Morristown	Morris	NJ	\N	973-455-2065	\N	\N	Mon–Sat 12–1 PM	Open to all in need	f	https://www.morriscommunitykitchen.org	2025-11-11 14:08:52.741	2025-11-11 14:08:52.741
24	Interfaith Food Pantry (Morristown)	Weekly food distribution for Morris County residents.	food_pantry	135 Speedwell Ave	Morristown	Morris	NJ	\N	973-538-8049	\N	\N	Wed & Thu 9–11am	Morris County residents in need	f	https://www.interfaithfoodpantry.org	2025-11-11 14:08:52.742	2025-11-11 14:08:52.742
25	Cornerstone Shelter (Morris County)	Emergency shelter for single adults and families.	shelter	99 Spring St	Morristown	Morris	NJ	\N	973-539-2282	\N	\N	24/7 intake	Homeless individuals and families	t	Local shelter directory	2025-11-11 14:08:52.743	2025-11-11 14:08:52.743
\.


--
-- Data for Name: ResourceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ResourceCategory" ("resourceId", "categoryId") FROM stdin;
1	2
2	2
3	2
4	2
4	1
5	6
5	1
6	6
6	1
7	5
7	1
8	3
8	4
9	4
9	3
10	4
10	3
11	4
11	3
12	2
13	2
14	2
14	1
15	6
15	1
16	6
16	1
17	5
17	1
18	3
18	4
19	4
19	3
20	4
20	3
21	4
21	3
22	6
22	1
23	2
24	2
25	6
25	1
\.


--
-- Data for Name: ServiceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceCategory" (id, name) FROM stdin;
1	Shelter
2	Food
3	Health
4	Mental Health
5	Youth
6	Transitional Housing
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2d12cada-48a0-45de-9b68-4f824dc0aa6f	28615218d091f41e6ee4236ad8bd677e32ff8d99fd2ee4244f11acc3ce1a4bec	2025-11-11 08:05:17.972713-05	20251111130517_init	\N	\N	2025-11-11 08:05:17.96723-05	1
\.


--
-- Name: Resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Resource_id_seq"', 25, true);


--
-- Name: ServiceCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ServiceCategory_id_seq"', 6, true);


--
-- Name: ResourceCategory ResourceCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceCategory"
    ADD CONSTRAINT "ResourceCategory_pkey" PRIMARY KEY ("resourceId", "categoryId");


--
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCategory ServiceCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ServiceCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServiceCategory_name_key" ON public."ServiceCategory" USING btree (name);


--
-- Name: ResourceCategory ResourceCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceCategory"
    ADD CONSTRAINT "ResourceCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ResourceCategory ResourceCategory_resourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResourceCategory"
    ADD CONSTRAINT "ResourceCategory_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES public."Resource"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict qFLoB33A73r0sxLZjLgm6NBHBAo01mSDeYftHemix0JFrnLMks9Xcp2d8fZ77Ef

