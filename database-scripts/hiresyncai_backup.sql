--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Debian 17.0-1.pgdg120+1)
-- Dumped by pg_dump version 17.0 (Debian 17.0-1.pgdg120+1)

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

--
-- Name: job_listing_applications_stage; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_listing_applications_stage AS ENUM (
    'denied',
    'applied',
    'interested',
    'interviewed',
    'hired'
);


ALTER TYPE public.job_listing_applications_stage OWNER TO postgres;

--
-- Name: job_listings_experience_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_listings_experience_level AS ENUM (
    'junior',
    'mid-level',
    'senior'
);


ALTER TYPE public.job_listings_experience_level OWNER TO postgres;

--
-- Name: job_listings_location_requirement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_listings_location_requirement AS ENUM (
    'in-office',
    'hybrid',
    'remote'
);


ALTER TYPE public.job_listings_location_requirement OWNER TO postgres;

--
-- Name: job_listings_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_listings_status AS ENUM (
    'draft',
    'published',
    'delisted'
);


ALTER TYPE public.job_listings_status OWNER TO postgres;

--
-- Name: job_listings_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_listings_type AS ENUM (
    'internship',
    'part-time',
    'full-time'
);


ALTER TYPE public.job_listings_type OWNER TO postgres;

--
-- Name: job_listings_wage_interval; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.job_listings_wage_interval AS ENUM (
    'hourly',
    'yearly'
);


ALTER TYPE public.job_listings_wage_interval OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: job_listing_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_listing_applications (
    "jobListingId" uuid NOT NULL,
    "userId" character varying NOT NULL,
    "coverLetter" text,
    rating integer,
    stage public.job_listing_applications_stage DEFAULT 'applied'::public.job_listing_applications_stage NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_listing_applications OWNER TO postgres;

--
-- Name: job_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" character varying NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    wage integer,
    "wageInterval" public.job_listings_wage_interval,
    "stateAbbreviation" character varying,
    city character varying,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "locationRequirement" public.job_listings_location_requirement NOT NULL,
    "experienceLevel" public.job_listings_experience_level NOT NULL,
    status public.job_listings_status DEFAULT 'draft'::public.job_listings_status NOT NULL,
    type public.job_listings_type NOT NULL,
    "postedAt" timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_listings OWNER TO postgres;

--
-- Name: organization_user_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization_user_settings (
    "userId" character varying NOT NULL,
    "organizationId" character varying NOT NULL,
    "newApplicationEmailNotifications" boolean DEFAULT false NOT NULL,
    "minimumRating" integer,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.organization_user_settings OWNER TO postgres;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id character varying NOT NULL,
    name character varying NOT NULL,
    "imageUrl" character varying,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: user_notification_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notification_settings (
    "userId" character varying NOT NULL,
    "newJobEmailNotifications" boolean DEFAULT false NOT NULL,
    "aiPrompt" character varying,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_notification_settings OWNER TO postgres;

--
-- Name: user_resumes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_resumes (
    "userId" character varying NOT NULL,
    "resumeFileUrl" character varying NOT NULL,
    "resumeFileKey" character varying NOT NULL,
    "aiSummary" character varying,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_resumes OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    name character varying NOT NULL,
    "imageUrl" character varying NOT NULL,
    email character varying NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: job_listing_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_listing_applications ("jobListingId", "userId", "coverLetter", rating, stage, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: job_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_listings (id, "organizationId", title, description, wage, "wageInterval", "stateAbbreviation", city, "isFeatured", "locationRequirement", "experienceLevel", status, type, "postedAt", "createdAt", "updatedAt") FROM stdin;
0bb7dd12-d2df-4041-8cdb-b1a5193741f7	org_30ST7Ki6gsBHZFdzcSxntYgBdiY	Next Js Developer	**Must Have Skills:**&#x20;\n\n• NextJS, Sitecore XM Cloud, Tailwind CSS,\n\n• .NET NextJS is mandatory skill requirement.&#x20;\n\n**Nice to Have Skills:**\n\n• Experience with GitHub Copilot,Shift-Left\n\n• Testing on TypeScript and DevOps (CI/CD Pipeline)\n**Detailed Job Description:**\n\nTo work closely with client as a web developer for clients ongoing project where they are rebuilding and migrating their internal app to a new tech (NextJS)\n\n**Top 2 responsibilities**\n\n• Web development using NextJs;\n\n• Experience with Website Maintenance and Enhancements\n\n• Collaborate closely with client stakeholders	65000	yearly	VIC	Melbourne	f	in-office	junior	published	full-time	2025-07-27 12:40:09.756+00	2025-07-27 12:40:01.970375+00	2025-07-27 12:40:09.756+00
7c032855-64a6-4aa8-be00-7931858176f8	org_30ST7Ki6gsBHZFdzcSxntYgBdiY	Technical Business Analyst	Senior Technical Business Analyst with 8 years of experience.&#x20;\n\n\n\n• Driving the achievement of clients strategy by working with stakeholders as directed to elicit,&#x20;\n\n\n\nanalyze, test/adjust, communicate, validate and manage requirements for changes to systems,&#x20;\n\n\n\nbusiness processes, policies, information and data.&#x20;\n\n\n\n• Managing requirements through the delivery lifecycle to meet business needs.&#x20;\n\n\n\n• Providing recommendations for process redesign and improvements and&#x20;\n\n\n\nbusiness solutions, enabling changes to processes, policy and/or information.&#x20;\n\n\n\n• Supporting the wider project/ program team on key change activities to&#x20;\n\n\n\nensure change is embedded sustainably.&#x20;\n\n\n\n• Work with business and technical stakeholders to gather and document&#x20;\n\n\n\ndetailed requirements and often translating this into technical specifications.&#x20;\n\n\n\n• Effectively communicating with both technical and non-technical&#x20;\n\n\n\nstakeholders throughout the project lifecycle&#x20;\n\n\n\n• Collaborate with Solution Designer, and Development Team to ensure&#x20;\n\n\n\nseamless integration of the platform.&#x20;\n\n\n\n• Facilitate workshops and conduct impact assessments&#x20;\n\n\n\n• Define and maintain user stories and process flows.&#x20;\n\n\n\n• Support UAT for enhancements or migrations.&#x20;\n\n\n\n• Review Test Cases/Scenarios&#x20;\n\n\n\nNice to have skills:&#x20;\n\n\n\nAS, R-Programming, Python, Big Data, Hadoop	80000	yearly	NSW	Sydney	f	in-office	junior	published	full-time	2025-07-27 12:40:48.751+00	2025-07-27 12:40:45.122257+00	2025-07-27 12:40:48.751+00
66ee26f5-f8fe-4bbc-a6a8-2f38f989f5fe	org_30SRX5mn4qsXRUeA59ejawEIJxH	Settlement Analyst	**Maple Asset Finance** is seeking an experienced **Settlement Analyst** to join our dynamic team. We’re looking for someone with a background in **commercial asset finance**, a sharp eye for detail, and a passion for delivering exceptional customer outcomes. This is a high-impact role suited to professionals who thrive in a fast-paced environment and are ready to contribute to a growing business.\n\n**What You’ll Do:**\n\n* Accurately process settlements in a timely manner\n* Verify settlement conditions and manage applications through to payment disbursement\n* Communicate clearly and professionally with brokers and internal teams\n* Identify and manage fraud risks and document execution issues\n* Assess supplier risk and ensure data quality across applications\n* Ensure compliance with AML/CTF policies and internal procedures\n* Support operational tasks and contribute to continuous process improvement\n\n**What You Bring:**\n\n* Bachelor’s degree in Commerce, Finance, Accounting, or Law (preferred)\n* Minimum 1 year of experience in a settlements or similar operational role\n* Prior experience in SME or commercial asset finance lending (advantageous)\n* Strong analytical and critical thinking skills with sound risk judgement\n* High attention to detail and ability to multitask effectively\n* Excellent written and verbal communication skills\n* Customer-focused with a proactive and collaborative approach\n\n**Why Join Us?**\n\n* **Driven Team:** Be part of a high-performance team focused on achieving results.\n* **Flexibility and Trust:** At Maple, we offer the flexibility to manage your work in a way that suits your goals, with the trust that you’ll deliver results. We empower you to take ownership of your role and approach your work in a way that maximizes your success.\n* **Make an Impact & Grow with Us:** This is a unique opportunity to contribute directly to the development of our business and grow as we continue to scale. You’ll have the potential to expand your role and advance your career as the organization evolves.\n\n**About Maple**&#x20;\n\nMaple is an independent asset finance lender committed to reshaping the commercial finance experience. We believe in building strong partnerships and making it easy to do business. Our culture is collaborative, fast-moving, and focused on results.\n\n**Apply now and take your career to the next level with an industry leader in asset finance!**	85000	yearly	NSW	Sydney	f	hybrid	junior	published	full-time	2025-07-27 12:41:09.153+00	2025-07-27 12:30:56.888413+00	2025-07-27 12:41:09.153+00
0dd2000c-3c7f-4be2-9c65-c9c1244d4559	org_30SdGqAliowJDUBi3Gfy1z3Nbxx	Python Engineer & Generative AI	Are you a Python engineer with a passion for generative AI? Do you dream of building something extraordinary and seeing it make a real impact at leading companies? We’re looking for someone like you – an ambitious coder who thrives on innovation, rapid growth, and tackling big challenges in a fun, supportive environment.\n\nAs a mid-level **Python Engineer (Generative AI)** at Enterprise AI Group, you’ll work at the intersection of software development and machine learning. Your code will directly contribute to our intelligent SaaS platform, helping major organisations harness AI to **drive efficiency, enhance customer engagement, and turn data into actionable insights**. In short, you’ll play a key role in our mission to bring AI into real-world workflows quickly and safely, transforming how businesses operate with cutting-edge tech.\n\n\n\n**What you'll be doing**\n\n* **Full-time, 5 days onsite (Martin Place, Sydney).** We iterate face-to-face to outpace competitors.\n* Build new features and RESTful APIs using Python (FastAPI) to expand our generative AI platform’s capabilities.\n* Develop and fine-tune AI-driven services using large language models.\n* Leverage Azure’s AI ecosystem: integrate **Azure OpenAI, Cognitive Search, and data services** into our products, and connect our platform with client systems via APIs.\n* Optimise our AI pipelines for scalability: work with **MongoDB/Cosmos DB** and vector databases to handle big data efficiently.\n* Collaborate closely with a tight-knit team of engineers and data scientists, rapidly prototyping ideas (Monday brainstorm to Friday demo is how we roll!) and delivering improvements that wow our customers.\n\n\n\n**What we're looking for**\n\nMust-haves:\n\n* **Strong Python skills:** You’ve built backend applications or APIs (FastAPI or similar) and can write clean, efficient code.\n* **AI/ML enthusiasm:** Hands-on experience with machine learning or generative AI (NLP, large language models) – you’ve maybe played with GPT APIs and can show us your projects in Github\n* **Problem-solving mindset:** Love tackling complex problems and debugging; you’re logical, curious, and resourceful.\n* **Team player:** Great communication skills and **collaborative spirit** – you thrive in a team, sharing ideas and building solutions together.\n* **BS/MS in CompSci (or equivalent experience):** A solid foundation in CS principles and the ability to learn new tech quickly.\n\n\n\n**Nice-to-haves:**\n\n* **Node.js or Full-Stack:** Some experience with Node or front-end frameworks (React/Next.js) – we appreciate versatility.\n* **Azure/cloud experience:** Familiarity with Azure AI Services, Azure ML, or cloud infrastructure (Azure DevOps, Bicep/Terraform) is a big plus.\n* **Search/DB expertise:** Experience with search engines or graph/vector databases for semantic search.\n* **Certifications:** Azure or AI certifications, or any cool **open-source AI projects** you’ve contributed to – show off your passion!\n\n\n\n**What we offer**\n\n* **Salary:** A$95K – A$120K + ESOP (employee stock ownership plan).\n* **Career growth:** Fast-track progression in a scaling startup – we’ll support your development into senior roles as we grow.\n* **Culture & Diversity:** A dynamic, fun, **inclusive** workplace – no egos, no old-school corporate vibe. We celebrate diversity and everyone’s ideas matter.\n* **Tech & Innovation:** Work with the latest tech (see *Our Tech Stack* below) on challenging projects. Your ideas turn into features **without red tape** – *ideas on Monday, prototypes by Friday* is how we operate.\n* **Impact:** **Your decisions power mission-critical AI workflows for tier-one clients.** You’ll see the direct results of your work in real businesses every day.\n* **Speed & support:** Quick, candidate-friendly hiring process (we won’t leave you hanging). Expect mentorship, hackathons, and a team that’s got your back from day one.\n\n\n\n**Our Tech Stack**\n\n* **Backend:** Python, FastAPI\n* **Databases & AI:** MongoDB, Cosmos DB, vector & graph DBs\n* **Cloud:** Azure (everything)\n* **Frontend:** Next.js, TypeScript, PayloadCMS\n\n**About us**\n\n**Enterprise AI** is a Sydney-based AI startup delivering cutting-edge generative AI solutions on a SaaS platform so clients get results fasterau.linkedin.com. We bridge AI theory with real-world impact, helping enterprises stay ahead of the competition with data-driven, scalable technology. Founded in 2024, we’re already partnering with major players (like Microsoft) and serving **government and top-tier industries** with our AI products. Our team culture is high-energy, collaborative, and innovative – we move fast, learn faster, and have fun doing it.\n\n\n\nSend your CV or LinkedIn profile to **talent@enterpriseaigroup.com** – we usually reply within 48 hours.	110000	yearly	NSW	Sydney	f	in-office	junior	published	full-time	2025-07-27 14:01:30.513+00	2025-07-27 14:01:24.359942+00	2025-07-27 14:01:30.514+00
2c8a486f-4a6f-4d90-b497-a4e3e9b6cc6f	org_30SdGqAliowJDUBi3Gfy1z3Nbxx	React / Next.js Engineer – Generative AI SaaS	Mid-level React & Next.js Engineer for a Generative AI SaaS startup in Sydney! Full-time onsite role building cutting-edge AI-powered features in a dynamic environment. You’ll join a small, high-energy team embedding generative AI into real-world enterprise workflows. We iterate face-to-face (5 days a week in our Martin Place office) to outpace competitors, so your ideas go from whiteboard to production fast. You’ll take ownership of core front-end features and see your work make a **huge impact** on business users every day.\n\n\n\n\n**What you’ll be doing**\n\n* **Building** sleek, responsive UIs with React, Next.js and TypeScript to deliver new AI-driven features\n* **Integrating** our front-end with backend APIs and OpenAI GPT-4 services to create seamless generative AI experiences\n* **Collaborating** closely with designers and product managers to shape an intuitive UX for complex enterprise workflows\n* **Optimising** performance and reliability – ensuring our app is snappy and secure for thousands of users\n* **Iterating** rapidly: prototyping ideas, testing with users, and shipping improvements in an agile, continuous delivery environment\n* **Contributing** your insights to product direction – we value team members who speak up and drive innovation\n\n\n\n\n**What we’re looking for**\n\n**Must-haves:**\n\n* 3+ years of hands-on experience building modern front-end applications with **React.js** and **Next.js** (including SSR)\n* Strong proficiency in **JavaScript/TypeScript**, HTML5/CSS3, and front-end tooling\n* Experience consuming RESTful APIs or GraphQL, and understanding of web app architecture (client/server)\n* A knack for problem-solving and writing clean, maintainable code (you love to **ship** well-tested features)\n* Great communication and teamwork skills – you enjoy brainstorming in person and iterating quickly with others\n* **Sydney-based** with full working rights in Australia (this role is 100% on-site; we do not offer visa sponsorship)\n* Passion for generative AI and eagerness to learn AI integration – you’re excited about what tools like GPT can do for users. We would love to see your github repo, about what you are passionate about\n\n\n\n\n**Nice-to-haves:**\n\n* Familiarity with **Node.js** or backend development (on Next.js functions and APIs)\n* Exposure to **AI/ML** frameworks or APIs (e.g. OpenAI, TensorFlow) – any hackathon or side-project with GPT models is a plus\n* Experience at a startup or in a fast-paced product team where you’ve worn multiple hats\n* Knowledge of modern front-end styling and build tools (Tailwind CSS, webpack, etc.)\n* Understanding of cloud platforms like **AWS** and CI/CD pipelines (Docker, GitHub Actions)\n\n\n\n\n**What we offer**\n\n* **Competitive salary + equity:** Starting from A$100,000 base + Employee Share Options – you’ll share in our success\n* **High-impact culture:** We have a *culture that ships* – we collaborate in person, move fast, and release often to stay ahead\n* **Career growth:** Grow with us – you’ll take on more responsibility over time, learn from experienced tech leaders, and accelerate your development\n* **Modern tech & tools:** Work with the latest stack (React, Next.js, TypeScript, AI/ML APIs) and propose new tools – we love adopting best tech for the job\n* **Inclusive, fun team:** Join a friendly, diverse group that celebrates ideas and wins. We brainstorm over coffee, bond over team lunches, and enjoy a bit of banter\n* **Fast process:** No drawn-out interviews – our hiring process is quick and transparent, and we respect your time (expect feedback within days)\n\n\n\n\n**Our Tech Stack**\n\n* **Front-end:** React, Next.js, TypeScript, Tailwind CSS\n* **Back-end:** Node.js (serverless APIs), Python (for AI/ML services)\n* **AI/ML:** OpenAI GPT-4, LangChain, and other generative AI frameworks\n* **Infrastructure:** Everything Azure\n\n\n\n\n**About us**\n\n**Enterprise AI** is a Sydney-based startup on a mission to *improve the most important workflows and customer journeys for enterprise teams by embedding generative AI solutions* into daily operations. We’re already making waves – our platform is in pilot with several large enterprise customers, and user feedback has been phenomenal. Our culture is casual, dynamic and fun: we work face-to-face at our Martin Place HQ, iterate relentlessly, and celebrate each win (game nights and team dinners included!). We’re a tight-knit crew of ambitious, high-performing developers who believe in owning our work and building something game-changing together.\n\n&#x20;\n\nSend your CV or LinkedIn profile to talent@enterpriseaigroup.com – we usually reply within 48 hours.	90000	yearly	NSW	Sydney	f	in-office	junior	published	full-time	2025-07-27 14:02:06.721+00	2025-07-27 14:02:03.560272+00	2025-07-27 14:02:06.722+00
a07a902b-14af-4d45-a9e1-81a906a299c7	org_30SdGqAliowJDUBi3Gfy1z3Nbxx	Head of Engineering	You’re a senior developer at heart, fluent in **Python** and **JavaScript/TypeScript** – and you still love to code. You can dive into a Python backend or a Node/TypeScript frontend (we use FastAPI and Next.js) and solve problems alongside your team. Your code reviews are legendary for spotting edge cases and elevating quality.\n\n\n\n\nAs Head of Engineering at Enterprise Ai, you will lead a talented team of engineers to deliver innovative AI solutions that drive the company's growth and success. This is a full-time position based in our Sydney, NSW office. You will be responsible for the overall technical direction and execution of our product roadmap, ensuring the delivery of high-quality, scalable and secure software systems.\n\n\n\n\n**What you'll be doing**\n\n* Provide strategic and technical leadership to the engineering team, setting the technical vision and establishing best practices\n* Manage the design, development and deployment of enterprise-grade AI solutions\n* Oversee the software development lifecycle, including planning, resource allocation, and process improvement\n* Foster an onsite culture of collaboration, innovation and continuous learning within the engineering team. The Gen AI world is moving fast, scheduled meetings are a fallback option, we need to meet, align, and get moving again, over a coffee, at lunch, or just by shouting over the floor\n* Identify and mitigate technical risks, ensuring the reliability and performance of our systems\n* Work closely with Product, Design and other cross-functional teams to deliver exceptional customer experiences\n* Mentor and develop the engineering team, supporting their growth and career progression\n* Champion engineering excellence and ensure adherence to coding standards and best practices\n\n\n\n\n**What we're looking for**\n\n* **8+ yrs software engineering, 3+ yrs leading teams, with a passion for fostering a culture of innovation, collaboration and continuous improvement**\n* Proven track record of leading and scaling high-performing engineering teams\n* Extensive experience in the design and development of complex, distributed software systems, potentially a proven record of building, deploying, and operating PaaS/SaaS at scale.\n* Proficiency in modern software engineering practices, including agile methodologies, DevOps, CICDand cloud-based architectures\n* Deep Python + JS/TS skills, cloud‑native skills on Azure (or AWS/GCP), frameworks and tools used in AI and software development\n* Excellent communication and stakeholder management skills, with the ability to translate technical concepts to all\n* Demonstrated problem-solving and decision-making skills, with a focus on delivering results. You want to work and drive an iterative, agile culture, fast, transparent, zero red tape—ideas on Monday, prototypes by Friday, and testing MVPs with customers as quickly as possible\n\n\n\n\n**What we offer**\n\nAt Enterprise Ai, we are committed to providing a rewarding and fulfilling work environment for our employees. Some of the key benefits we offer include:\n\n* Competitive salary and Employee Share Options Program\n* Employee Value Proposition, including, generous learning and development opportunities, and wellness\n* A diverse and inclusive workplace with opportunities for career growth, as we grow, the opportunities will\n* Team-building activities and social events to foster collaboration and camaraderie\n\n\n\n\n**About us**\n\nEnterprise Ai is a leading provider of innovative AI solutions that help organisations unlock the power of their data. Our mission is to revolutionise the way businesses operate through the transformative power of artificial intelligence. With a team of passionate and talented individuals, we are dedicated to pushing the boundaries of what's possible in the world of Generative AI.\n\nIf you're excited about the prospect of leading our engineering team and contributing to the growth of Enterprise Ai, we'd love to hear from you. **Apply now** to join our dynamic and innovative company.\n\n\n\n\nSend your CV or LinkedIn profile to **talent@enterpriseaigroup.com** – we usually reply within 48 hours.	150000	yearly	NSW	Sydney	f	in-office	junior	published	full-time	2025-07-27 14:02:31.302+00	2025-07-27 14:02:28.407373+00	2025-07-27 14:02:31.302+00
2b77922d-57eb-49e4-a698-75ef1eced013	org_30SdxR9rZGkcQg26tgomARv7Cvv	Shopify Web Designer – CRO & UX/UI Specialist	**Rate:** $50/hour (or fixed project rate for key pages)\n\n**Commitment:** Project-based, with ongoing work (1–2 landing pages/week)\n\n**Location:** Remote\n\n**Start:** ASAP\n\n\n\n\nAbout Us\n\nWe’re a health venture studio launching **Shopify-based brands** across women's health, supplements, keto diets, hangover prevention, pet wellness, and more.\n\nWe’re seeking a **high-converting landing page expert** who can take a brief, understand the customer journey, and design pages that are **clean, fast, beautiful, and built to convert**.\n\n\nWhat You’ll Be Doing\n\n* Design **conversion-optimised landing pages** in Shopify (via Replo, GemPages, Shogun, or native theme builder)\n* Create pages for quizzes, product bundles, lead magnets, and upsells\n* Apply UX principles to reduce friction and boost AOV, CVR, and retention\n* Collaborate with our copywriters, funnel strategist, and Klaviyo/email team\n* Deliver fast, mobile-optimised designs with a clear visual hierarchy and CTA strategy\n* Optional: Figma mockups or direct build inside Shopify (we prefer Replo)\n\n\nIdeal Skills & Experience\n\n* 3+ years designing **Shopify product and landing pages**\n* Proven track record of increasing **conversion rates and reducing bounce**\n* Tools: Shopify, Replo (preferred), Shogun, PageFly, Figma\n* Strong understanding of **UX/UI best practices**, ecommerce psychology, and mobile-first design\n* Bonus: Experience in **health, wellness, or supplement** niches\n* Bonus: Able to troubleshoot Shopify theme code or CSS for speed/UX fixes\n\n\nYou Are\n\n* Detail-obsessed with a strong eye for clean, modern aesthetics\n* Skilled in **building pages that SELL**, not just look good\n* A clear communicator who takes initiative and meets deadlines\n* Able to juggle **multiple brands/projects** while keeping quality high	50	hourly	SA	Adelaide	f	in-office	junior	published	full-time	2025-07-27 14:06:24.182+00	2025-07-27 14:06:20.638973+00	2025-07-27 14:06:24.182+00
01d4e098-84d1-4aa1-a778-689c42163440	org_30SdxR9rZGkcQg26tgomARv7Cvv	Digital Marketing Specialist	We’re looking for a **creative-minded digital marketing strategist** who can take charge of our paid ad campaigns across **Meta, Google, and TikTok**. You’ll lead the creative direction of hooks, offers, and messaging for fast-growing DTC health and wellness brands. This role is about **testing, iterating, and scaling,** not just brand awareness. You must love **revenue-driven creativity**, **direct response marketing**, and **rapid campaign execution**.\n\n\nResponsibilities:\n\n* **Own creative strategy** across Meta, Google, TikTok; lead ad angles, hooks, scripts, and visual briefs\n* Research competitors and winning ads to **craft irresistible value props** and testable creative ideas\n* Launch, monitor, and optimize **high-converting ad campaigns** with tight feedback loops\n* Collaborate with CRO, email, and landing page teams to ensure funnel consistency\n* Use data (CTR, CAC, AOV, ROAS) to guide creative testing decisions\n* Work across **5 early-stage brands** simultaneously, each with a small, scrappy budget\n* Ideate and execute **fast creative testing loops;**  including UGC briefs, native video ads, and sales page hooks\n* Contribute ideas to **offers, bundles, and funnels** that maximize AOV and retention\n\n\nRequirements:\n\n* 3+ years in **direct-response performance marketing** or DTC paid media\n* Proven track record of running ad campaigns that generated **actual sales**\n* Deep understanding of **creative strategy, hooks, angles, and psychological triggers**\n* Experience scaling brands on **Meta Ads (Facebook/Instagram)**, TikTok Ads, and Google PPC\n* Comfortable testing **multiple concepts weekly** and optimizing based on results\n* Strong communication and collaboration with designers, copywriters, and media buyers\n* Bonus: Knowledge of health, supplements, women’s wellness, or consumer packaged goods (CPG)	65000	yearly	SA	Adelaide	f	in-office	junior	published	full-time	2025-07-27 14:06:52.377+00	2025-07-27 14:06:49.34408+00	2025-07-27 14:06:52.377+00
47fdd44b-9698-4e88-b941-11d7e29d9a51	org_30SdxR9rZGkcQg26tgomARv7Cvv	Klaviyo / Sales Funnel Specialist (Health & eCommerce Focus)	We run a portfolio of fast-growing ecommerce and digital health startup brands. Each brand is supported by a high-performance remote team. We’re obsessed with data, CRO, clean UI/UX, and conversion-driven customer journeys.\n\n\n\n\n**Rate:** $50/hour\n\n**Commitment:** 1 day per week (approx. 8 hours)\n\n**Location:** Remote (Flexible timezone)\n\n**Start:** ASAP\n\n\n\n\nWe’re now looking for a **Klaviyo / Sales Funnel Specialist** to help design, execute, and optimise email journeys across our brands—especially for quiz-driven and product launch funnels.\n\n\n\n\nWhat You’ll Do\n\n* Build and optimise **Klaviyo email flows** (welcome, cart abandonment, post-purchase, win-back, etc.)\n* Create segmentation strategies for high-converting **campaigns and automations**\n* **Collaborate with our copywriters and designers to implement high-CRO funnels**\n* **Use A/B testing and data analytics to improve deliverability, open rates, and revenue per recipient**\n* **Help integrate Klaviyo with quiz funnels, Shopify, landing pages, and lead magnets**\n* **Contribute to strategic funnel ideas** for product launches and promotions\n\n\n\n\nSkills & Experience\n\n* Proven **Klaviyo expertise** with Shopify integrations\n* Experience with **email marketing in health, beauty, or ecommerce niches**\n* **Strong understanding of sales funnels**, lead nurturing, and LTV maximisation\n* Confident using data (heatmaps, CTRs, open rates) to guide strategy\n* Bonus: Knowledge of tools like Figma, Shopify, Canva\n* Excellent English communication and an eye for good branding and tone of voice\n\n\n\n\nYou’re a Great Fit If You:\n\n* Love building **smart, automated systems that convert**\n* **Understand the emotional journey of customers, especially women’s health and wellness** audiences\n* Are proactive, organised, and results-driven\n* Can handle **multiple brands** and enjoy variety in your work\n* Want to grow with a mission-led team focused on **health innovation and scale**	65000	yearly	SA	Adelaide	f	in-office	junior	published	full-time	2025-07-27 14:07:21.743+00	2025-07-27 14:07:18.464506+00	2025-07-27 14:07:21.743+00
6297b855-e976-4919-9018-bd92151c92f2	org_30SdxR9rZGkcQg26tgomARv7Cvv	Brand & Packaging Designer (Health + Tech Startups)	We’re **Goodness Holdings**, a fast-moving venture studio building brands at the intersection of **health, beauty and technology**. We’re looking for a **Brand & Digital Designer** to join us on contract ($50/hr) and bring stunning visual cohesion to our portfolio of early-stage startups.\n\nIf you live and breathe design systems, packaging, and modern media, we want to meet you!\n\n\n\n\nWHAT YOU’LL WORK ON\n\n* Designing **lo-fi brand launches** for health and wellness ventures\n* Building **visual identities**: logos, type, colour systems, design guidelines\n* **Packaging design** for supplements, skincare and wellness products\n* **Landing pages in Figma** clear, clean, high-converting\n* **Shopify assets**: filling out templates with hero images, banners, product graphics, icons\n* Creating **static ads, digital content, and brand imagery**\n* Selecting and curating **photos, videos and multimedia** for a unified brand look\n* Collaborating with a lean, fast-moving team of founders and marketers\n\n\n\n\nWHAT WE’RE LOOKING FOR\n\n* A strong aesthetic eye **clean, modern, minimal, beautiful**\n* Portfolio across **health, tech or consumer products**\n* Fluent in **Figma**; bonus if familiar with Canva, Webflow or Shopify\n* Experience with **packaging** and **digital brand rollouts**\n* A love for **systems, storytelling, and scalable design**\n* Bonus: **motion, video, or photo editing** skills\n\n\n\n\n&#x20;DETAILS\n\n* **Adelaide-based** (we’re in the CBD/ hybrid OK)\n* **$50/hr contractor** role (project-based to start)\n* Flexible hours with opportunity for ongoing work\n* Design across a growing portfolio of **venture-backed startups**\n\n\n\n\n**Ready to make health tech beautiful?**\n\n&#x20;Send your **portfolio + a short intro** to admin@goodnessnutrition.com	70000	yearly	NSW	Adelaide	f	in-office	junior	published	full-time	2025-07-27 14:07:55.169+00	2025-07-27 14:07:52.087784+00	2025-07-27 14:07:55.169+00
\.


--
-- Data for Name: organization_user_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization_user_settings ("userId", "organizationId", "newApplicationEmailNotifications", "minimumRating", "createdAt", "updatedAt") FROM stdin;
user_30SRTqVwZgU0WSOjfJKSVXhfM6s	org_30SRX5mn4qsXRUeA59ejawEIJxH	f	\N	2025-07-27 12:30:32.207118+00	2025-07-27 12:30:32.207118+00
user_30ST3l34RK8gWUgl2ZbysySFheD	org_30ST7Ki6gsBHZFdzcSxntYgBdiY	f	\N	2025-07-27 12:39:52.607261+00	2025-07-27 12:39:52.607261+00
user_30SdDmbLf3YkNkUpVxeQYW3MIV0	org_30SdGqAliowJDUBi3Gfy1z3Nbxx	f	\N	2025-07-27 14:00:19.172495+00	2025-07-27 14:00:19.172495+00
user_30SduIoYQ4JyieA3Cv0FgCpuy9L	org_30SdxR9rZGkcQg26tgomARv7Cvv	f	\N	2025-07-27 14:05:54.122317+00	2025-07-27 14:05:54.122317+00
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, name, "imageUrl", "createdAt", "updatedAt") FROM stdin;
org_30SRX5mn4qsXRUeA59ejawEIJxH	Maple Asset Finance	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMwU1JYRlA4OVljcUU0azZXOVdQWFUwUW1tdyJ9	2025-07-27 12:23:43.807+00	2025-07-27 12:23:44.467+00
org_30ST7Ki6gsBHZFdzcSxntYgBdiY	Innovate IT Australia	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMwU1Q3T01IaFMyY2YzVWYwVzNUS2Q3TmZtTCJ9	2025-07-27 12:36:45.04+00	2025-07-27 12:36:45.592+00
org_30SdGqAliowJDUBi3Gfy1z3Nbxx	Enterprise AI Group	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMwU2RHcXh5WDFFSWF0c2dEeVFZSVk0RmNhdCJ9	2025-07-27 14:00:14.234+00	2025-07-27 14:00:14.857+00
org_30SdxR9rZGkcQg26tgomARv7Cvv	Goodness Labs	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMwU2R4Wm9xUUs0Unp3elNaZjNIV3dnYjV6ZSJ9	2025-07-27 14:05:53.776+00	2025-07-27 14:05:54.341+00
\.


--
-- Data for Name: user_notification_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notification_settings ("userId", "newJobEmailNotifications", "aiPrompt", "createdAt", "updatedAt") FROM stdin;
user_30SRTqVwZgU0WSOjfJKSVXhfM6s	f	\N	2025-07-27 12:30:32.186642+00	2025-07-27 12:30:32.186642+00
user_30ST3l34RK8gWUgl2ZbysySFheD	f	\N	2025-07-27 12:39:52.607258+00	2025-07-27 12:39:52.607258+00
user_30SdDmbLf3YkNkUpVxeQYW3MIV0	f	\N	2025-07-27 13:59:51.071725+00	2025-07-27 13:59:51.071725+00
user_30SduIoYQ4JyieA3Cv0FgCpuy9L	f	\N	2025-07-27 14:05:29.898954+00	2025-07-27 14:05:29.898954+00
\.


--
-- Data for Name: user_resumes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_resumes ("userId", "resumeFileUrl", "resumeFileKey", "aiSummary", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, "imageUrl", email, "createdAt", "updatedAt") FROM stdin;
user_30SRTqVwZgU0WSOjfJKSVXhfM6s	Raman Wadhwa	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yeXVVamVsamN3cnJmN0JSbHZuQ1lnMlpiSjIiLCJyaWQiOiJ1c2VyXzMwU1JUcVZ3WmdVMFdTT2pmSktTVlhoZk02cyIsImluaXRpYWxzIjoiUlcifQ	maple@gmail.com	2025-07-27 12:23:17.868+00	2025-07-27 12:23:17.893+00
user_30ST3l34RK8gWUgl2ZbysySFheD	Nabin Panta	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yeXVVamVsamN3cnJmN0JSbHZuQ1lnMlpiSjIiLCJyaWQiOiJ1c2VyXzMwU1QzbDM0Uks4Z1dVZ2wyWmJ5c3lTRmhlRCIsImluaXRpYWxzIjoiTlAifQ	innovate@gmail.com	2025-07-27 12:36:16.022+00	2025-07-27 12:36:16.045+00
user_30SdDmbLf3YkNkUpVxeQYW3MIV0	Brendon Roche	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yeXVVamVsamN3cnJmN0JSbHZuQ1lnMlpiSjIiLCJyaWQiOiJ1c2VyXzMwU2REbWJMZjNZa05rVXBWeGVRWVczTUlWMCIsImluaXRpYWxzIjoiQlIifQ	enterprise@gmail.com	2025-07-27 13:59:50.448+00	2025-07-27 13:59:50.468+00
user_30SduIoYQ4JyieA3Cv0FgCpuy9L	Ian Stewart	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yeXVVamVsamN3cnJmN0JSbHZuQ1lnMlpiSjIiLCJyaWQiOiJ1c2VyXzMwU2R1SW9ZUTRKeWllQTNDdjBGZ0NwdXk5TCIsImluaXRpYWxzIjoiSVMifQ	goodnesscompany@gmail.com	2025-07-27 14:05:28.887+00	2025-07-27 14:05:28.909+00
\.


--
-- Name: job_listing_applications job_listing_applications_jobListingId_userId_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_listing_applications
    ADD CONSTRAINT "job_listing_applications_jobListingId_userId_pk" PRIMARY KEY ("jobListingId", "userId");


--
-- Name: job_listings job_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_listings
    ADD CONSTRAINT job_listings_pkey PRIMARY KEY (id);


--
-- Name: organization_user_settings organization_user_settings_userId_organizationId_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_user_settings
    ADD CONSTRAINT "organization_user_settings_userId_organizationId_pk" PRIMARY KEY ("userId", "organizationId");


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: user_notification_settings user_notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT user_notification_settings_pkey PRIMARY KEY ("userId");


--
-- Name: user_resumes user_resumes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_resumes
    ADD CONSTRAINT user_resumes_pkey PRIMARY KEY ("userId");


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: job_listings_stateAbbreviation_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "job_listings_stateAbbreviation_index" ON public.job_listings USING btree ("stateAbbreviation");


--
-- Name: job_listing_applications job_listing_applications_jobListingId_job_listings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_listing_applications
    ADD CONSTRAINT "job_listing_applications_jobListingId_job_listings_id_fk" FOREIGN KEY ("jobListingId") REFERENCES public.job_listings(id) ON DELETE CASCADE;


--
-- Name: job_listing_applications job_listing_applications_userId_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_listing_applications
    ADD CONSTRAINT "job_listing_applications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: job_listings job_listings_organizationId_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_listings
    ADD CONSTRAINT "job_listings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_user_settings organization_user_settings_organizationId_organizations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_user_settings
    ADD CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES public.organizations(id);


--
-- Name: organization_user_settings organization_user_settings_userId_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_user_settings
    ADD CONSTRAINT "organization_user_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_notification_settings user_notification_settings_userId_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_settings
    ADD CONSTRAINT "user_notification_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_resumes user_resumes_userId_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_resumes
    ADD CONSTRAINT "user_resumes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

