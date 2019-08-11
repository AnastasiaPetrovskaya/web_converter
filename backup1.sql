--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Ubuntu 11.2-1.pgdg16.04+1)
-- Dumped by pg_dump version 11.2 (Ubuntu 11.2-1.pgdg16.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_check_points_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_check_points_type AS ENUM (
    'TC',
    'RA',
    'test',
    'exam',
    'attestation'
);


ALTER TYPE public.enum_check_points_type OWNER TO converter;

--
-- Name: enum_database_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_database_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE public.enum_database_type OWNER TO converter;

--
-- Name: enum_databases_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_databases_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE public.enum_databases_type OWNER TO converter;

--
-- Name: enum_question_db_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_question_db_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE public.enum_question_db_type OWNER TO converter;

--
-- Name: enum_question_query_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_question_query_type AS ENUM (
    'RA',
    'TC'
);


ALTER TYPE public.enum_question_query_type OWNER TO converter;

--
-- Name: enum_questions_db_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_questions_db_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE public.enum_questions_db_type OWNER TO converter;

--
-- Name: enum_questions_query_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE public.enum_questions_query_type AS ENUM (
    'RA',
    'TC'
);


ALTER TYPE public.enum_questions_query_type OWNER TO converter;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: check_point; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.check_point (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    date_from timestamp with time zone NOT NULL,
    date_to timestamp with time zone NOT NULL,
    url character varying(255),
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE public.check_point OWNER TO converter;

--
-- Name: check_point_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.check_point_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.check_point_id_seq OWNER TO converter;

--
-- Name: check_point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.check_point_id_seq OWNED BY public.check_point.id;


--
-- Name: check_points; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.check_points (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type public.enum_check_points_type NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    description text,
    test_config json,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE public.check_points OWNER TO converter;

--
-- Name: check_points_groups; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.check_points_groups (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    check_point_id integer,
    group_id integer NOT NULL
);


ALTER TABLE public.check_points_groups OWNER TO converter;

--
-- Name: check_points_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.check_points_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.check_points_groups_id_seq OWNER TO converter;

--
-- Name: check_points_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.check_points_groups_id_seq OWNED BY public.check_points_groups.id;


--
-- Name: check_points_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.check_points_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.check_points_id_seq OWNER TO converter;

--
-- Name: check_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.check_points_id_seq OWNED BY public.check_points.id;


--
-- Name: databases; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.databases (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    type public.enum_databases_type NOT NULL,
    note character varying(255),
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE public.databases OWNER TO converter;

--
-- Name: databases_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.databases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.databases_id_seq OWNER TO converter;

--
-- Name: databases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.databases_id_seq OWNED BY public.databases.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    department character varying(255),
    specialty character varying(255),
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE public.groups OWNER TO converter;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO converter;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: materials; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.materials (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    text text NOT NULL,
    material_type text NOT NULL,
    material_name text NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE public.materials OWNER TO converter;

--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.materials_id_seq OWNER TO converter;

--
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.materials_id_seq OWNED BY public.materials.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    tag character varying(255),
    query_type public.enum_questions_query_type NOT NULL,
    complexity integer NOT NULL,
    text text NOT NULL,
    sql_answer text NOT NULL,
    help character varying(255),
    last_using timestamp with time zone,
    db_type public.enum_questions_db_type NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    db_id integer NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE public.questions OWNER TO converter;

--
-- Name: questions_answers; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.questions_answers (
    id integer NOT NULL,
    answer json NOT NULL,
    processed_answer json,
    sql text,
    error text,
    mark integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    check_point_id integer,
    question_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.questions_answers OWNER TO converter;

--
-- Name: questions_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.questions_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_answers_id_seq OWNER TO converter;

--
-- Name: questions_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.questions_answers_id_seq OWNED BY public.questions_answers.id;


--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_id_seq OWNER TO converter;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role character varying(255) NOT NULL,
    permissions json NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO converter;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO converter;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.students (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.students OWNER TO converter;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.students_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.students_id_seq OWNER TO converter;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: tables; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.tables (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    db_id integer NOT NULL
);


ALTER TABLE public.tables OWNER TO converter;

--
-- Name: tables_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.tables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tables_id_seq OWNER TO converter;

--
-- Name: tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.tables_id_seq OWNED BY public.tables.id;


--
-- Name: test_cases; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.test_cases (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    check_point_id integer
);


ALTER TABLE public.test_cases OWNER TO converter;

--
-- Name: test_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.test_cases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_cases_id_seq OWNER TO converter;

--
-- Name: test_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.test_cases_id_seq OWNED BY public.test_cases.id;


--
-- Name: test_cases_questions; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.test_cases_questions (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    test_case_id integer,
    question_id integer NOT NULL
);


ALTER TABLE public.test_cases_questions OWNER TO converter;

--
-- Name: test_cases_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.test_cases_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_cases_questions_id_seq OWNER TO converter;

--
-- Name: test_cases_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.test_cases_questions_id_seq OWNED BY public.test_cases_questions.id;


--
-- Name: tests_answers; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.tests_answers (
    id integer NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone,
    total_mark integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    check_point_id integer,
    user_id integer NOT NULL,
    test_case_id integer NOT NULL
);


ALTER TABLE public.tests_answers OWNER TO converter;

--
-- Name: tests_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.tests_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tests_answers_id_seq OWNER TO converter;

--
-- Name: tests_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.tests_answers_id_seq OWNED BY public.tests_answers.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.tokens (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    role_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.tokens OWNER TO converter;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tokens_id_seq OWNER TO converter;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: converter
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    phone character varying(255),
    login character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    student_id integer,
    role_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO converter;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO converter;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: check_point id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_point ALTER COLUMN id SET DEFAULT nextval('public.check_point_id_seq'::regclass);


--
-- Name: check_points id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points ALTER COLUMN id SET DEFAULT nextval('public.check_points_id_seq'::regclass);


--
-- Name: check_points_groups id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points_groups ALTER COLUMN id SET DEFAULT nextval('public.check_points_groups_id_seq'::regclass);


--
-- Name: databases id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.databases ALTER COLUMN id SET DEFAULT nextval('public.databases_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: materials id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.materials ALTER COLUMN id SET DEFAULT nextval('public.materials_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: questions_answers id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions_answers ALTER COLUMN id SET DEFAULT nextval('public.questions_answers_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: tables id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tables ALTER COLUMN id SET DEFAULT nextval('public.tables_id_seq'::regclass);


--
-- Name: test_cases id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases ALTER COLUMN id SET DEFAULT nextval('public.test_cases_id_seq'::regclass);


--
-- Name: test_cases_questions id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases_questions ALTER COLUMN id SET DEFAULT nextval('public.test_cases_questions_id_seq'::regclass);


--
-- Name: tests_answers id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tests_answers ALTER COLUMN id SET DEFAULT nextval('public.tests_answers_id_seq'::regclass);


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: check_point; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.check_point (id, title, type, date_from, date_to, url, created, updated, owner_id) FROM stdin;
\.


--
-- Data for Name: check_points; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.check_points (id, title, type, start, "end", description, test_config, created, updated, owner_id) FROM stdin;
191	Контрольная работа №1	RA	2019-06-11 09:00:00+03	2019-06-11 13:00:00+03	\N	{"test_cases_amount":"","questions_amount":"4","mean_complexity":"","start_complexity":"3","great_complexity":"5","less_complexity":"2","unique_questions":"on"}	2019-06-11 10:19:28.132+03	2019-06-11 10:19:28.132+03	1
192	Контрольная работа №2	RA	2019-06-13 00:00:00+03	2019-06-14 00:00:00+03	\N	{"test_cases_amount":"","questions_amount":"3","mean_complexity":"","start_complexity":"4","great_complexity":"5","less_complexity":"3"}	2019-06-13 13:57:43.651+03	2019-06-13 13:57:43.651+03	1
193	Контрольная работа №3	RA	2019-06-13 00:00:00+03	2019-06-21 00:00:00+03	\N	{"test_cases_amount":"","questions_amount":"3","mean_complexity":"","start_complexity":"4","great_complexity":"5","less_complexity":"3"}	2019-06-13 15:15:08.67+03	2019-06-13 15:15:08.67+03	1
194	Контрольная работа №3.1	RA	2019-06-13 00:00:00+03	2019-06-21 00:00:00+03	\N	{"test_cases_amount":"3","questions_amount":"3","mean_complexity":"4","start_complexity":"","great_complexity":"","less_complexity":""}	2019-06-13 15:18:08.263+03	2019-06-13 15:18:08.263+03	1
\.


--
-- Data for Name: check_points_groups; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.check_points_groups (id, created, updated, check_point_id, group_id) FROM stdin;
172	2019-06-11 10:19:28.247+03	2019-06-11 10:19:28.247+03	191	11
173	2019-06-13 13:57:43.709+03	2019-06-13 13:57:43.709+03	192	11
174	2019-06-13 15:15:08.686+03	2019-06-13 15:15:08.686+03	193	11
175	2019-06-13 15:18:08.28+03	2019-06-13 15:18:08.28+03	194	11
\.


--
-- Data for Name: databases; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.databases (id, title, description, type, note, created, updated, owner_id) FROM stdin;
3	kino_1	база данных актеров кино и кинотеатров	prepare	экспорт из файла TestFull_One	2017-05-26 00:45:27.032+03	2017-05-26 00:45:27.032+03	1
2	kino_for_tests	база данных кинотеатров и фильмов	common		2017-06-09 02:23:08.679+03	2017-06-09 02:23:08.679+03	1
19	iytu	rirety	private		2019-02-22 04:22:45.153+03	2019-02-22 04:22:45.153+03	1
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.groups (id, title, department, specialty, created, updated) FROM stdin;
7	К05-224	22		2017-06-02 15:59:42.889+03	2017-06-02 15:59:42.889+03
1	М15-505	223		2017-06-02 14:13:43.057+03	2017-06-03 02:28:03.703+03
8	Б14-506	22	Программная инженерия	2018-05-11 22:12:44.799+03	2018-05-11 22:13:14.675+03
11	Б16-504	22	Программная Инженерия	2019-02-20 00:37:51.91+03	2019-02-20 00:37:51.91+03
\.


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.materials (id, title, text, material_type, material_name, created, updated) FROM stdin;
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.questions (id, title, tag, query_type, complexity, text, sql_answer, help, last_using, db_type, created, updated, db_id, owner_id) FROM stdin;
2	Фильмы на метро Университет		RA	2	Какие фильмы идут на станции метро Университет?\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	prepare	2017-06-05 00:39:59.199+03	2017-06-05 23:50:10.727+03	3	1
3	Фильмы на метро Университет		RA	2	Какие фильмы идут на станции метро Университет?\r\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	common	2017-06-09 02:48:30.49+03	2017-06-09 02:48:30.49+03	2	1
4	Фильмы на метро Коломенская		RA	2	Какие фильмы идут на станции метро Коломенская?\r\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Коломенская';		\N	common	2017-06-09 02:59:48.145+03	2017-06-09 02:59:48.145+03	2	1
7	 "Фильмы на метро Университет"		TC	3	Какие фильмы идут на станции метро Университет?\r\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	prepare	2017-10-03 16:27:21.885+03	2017-10-03 16:27:21.885+03	3	1
10	Более двух фильмов		TC	3	В каких кинотеатрах идет более двух фильмов ?	SELECT DISTINCT Z.*\r\nFROM Кинотеатры AS Z\r\nWHERE EXISTS \r\n (SELECT * FROM ФильмыКинотеатры AS X\r\n  WHERE X.ИдКинотеатра=Z.ИдКинотеатра AND EXISTS \r\n (SELECT * FROM ФильмыКинотеатры AS Y\r\n  WHERE X.ИдКинотеатра=Y.ИдКинотеатра AND X.ИдФильма<>Y.ИдФильма AND EXISTS \r\n (SELECT * FROM ФильмыКинотеатры AS U\r\n  WHERE Y.ИдКинотеатра=U.ИдКинотеатра AND Y.ИдФильма<>U.ИдФильма AND X.ИдФильма<>U.ИдФильма)));		\N	prepare	2017-11-19 02:27:08.332+03	2017-11-19 02:27:08.332+03	3	1
11	 "Фильмы на метро Университет"(копия)		TC	2	Какие фильмы идут на станции метро Университет?\r\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	common	2017-12-24 18:56:43.697+03	2017-12-24 18:56:43.697+03	2	1
12	Фильмы на метро Университет		RA	2	Какие фильмы идут на станции метро Университет?\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	prepare	2017-06-05 00:39:59.199+03	2017-06-05 23:50:10.727+03	3	1
5	Один фильм		RA	3	В каких кинотеатрах идет только один фильм ?\r\nОтвет(НазвКинотеатра, Название(Фильма))	SELECT DISTINCT X. НазвКинотеатра, Y.Название \r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND NOT EXISTS \r\n(SELECT * FROM Фильмы AS Y1, Кинотеатры AS X1, ФильмыКинотеатры AS Z1 \r\nWHERE X1.ИдКинотеатра=Z1.ИдКинотеатра AND Z1.ИдФильма=Y1.ИдФильма AND X.ИдКинотеатра=X1.ИдКинотеатра AND Y.ИдФильма<>Y1.ИдФильма);		\N	common	2017-06-09 03:00:36.739+03	2017-06-09 03:00:36.739+03	2	1
6	Два фильма		RA	4	В каких кинотеатрах идут два фильма ?\r\nОтвет(НазвКинотеатра, Название(Фильма))\r\n	SELECT DISTINCT X. НазвКинотеатра, Y.Название \r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS Y1, Кинотеатры AS X1, ФильмыКинотеатры AS Z1\r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND Y.ИдФильма<>Y1.ИдФильма AND X1.ИдКинотеатра=Z1.ИдКинотеатра AND Z1.ИдФильма=Y1.ИдФильма AND X.ИдКинотеатра=X1.ИдКинотеатра AND Y.ИдФильма<>Y1.ИдФильма AND NOT EXISTS \r\n(SELECT * FROM Фильмы AS Y2, Кинотеатры AS X2, ФильмыКинотеатры AS Z2 \r\nWHERE X2.ИдКинотеатра=Z2.ИдКинотеатра AND Z2.ИдФильма=Y2.ИдФильма AND X.ИдКинотеатра=X2.ИдКинотеатра AND Y.ИдФильма<>Y2.ИдФильма AND Y1.ИдФильма<>Y2.ИдФильма);		\N	common	2017-06-09 03:01:59.042+03	2017-06-09 03:01:59.042+03	2	1
13	Тестовый вопрос №1	Тест	RA	4	Тестовый вопрос №1	SELECT DISTINCT X.Год, X.Название\r\nFROM Фильмы AS X\r\nWHERE X.Страна = 'США'	Фильмы AS X\r\nX.Год, X.Название\r\nX[X.Страна = "США"]	\N	common	2019-03-13 20:31:53.45+03	2019-03-13 20:31:53.45+03	2	1
14	Тестовый вопрос №2	Тест	RA	4	Тестовый вопрос №2	SELECT DISTINCT X.Год, X.Название\r\nFROM Фильмы AS X\r\nWHERE X.Страна = 'США'	Фильмы AS X\r\nX.Год, X.Название\r\nX[X.Страна = "США"]	\N	common	2019-03-13 20:32:50.668+03	2019-03-13 20:32:50.668+03	2	1
15	Тестовый вопрос №3	Тест	RA	5	Тестовый вопрос №3(USA)	SELECT DISTINCT X.Год, X.Название\r\nFROM Фильмы AS X\r\nWHERE X.Страна = 'США'	Фильмы AS X\r\nX.Год, X.Название\r\nX[X.Страна = "США"]	\N	common	2019-04-09 13:03:04.214+03	2019-04-09 13:03:04.214+03	2	1
16	Тестовый вопрос №4	Тест	RA	5	Тестовый вопрос №4(Россия)	SELECT DISTINCT X.Год, X.Название\r\nFROM Фильмы AS X\r\nWHERE X.Страна = 'Россия'	Фильмы AS X\r\nX.Год, X.Название\r\nX[X.Страна = "США"]	\N	common	2019-04-09 13:04:06.44+03	2019-04-09 13:04:06.44+03	2	1
\.


--
-- Data for Name: questions_answers; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.questions_answers (id, answer, processed_answer, sql, error, mark, created, updated, check_point_id, question_id, user_id) FROM stdin;
164	[{"title":"more_then_1","alias":"Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N, ФильмыКинотеатры AS P ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"(((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.ИдКинотеатра = N.ИдКинотеатра AND Y.ИдФильма<> M.ИдФильма] ((N [N.ИдКинотеатра = P.ИдКинотеатра] P) [P.ИдФильма = M.ИдФильма] M))","description":"Кинотеатры, в которых идет более одного фильма","processed_query_body":"((X*Z*Y*N*P*M)[N.ИдКинотеатра=P.ИдКинотеатраANDP.ИдФильма=M.ИдФильмаANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.ИдФильма=Y.ИдФильмаANDX.ИдКинотеатра=N.ИдКинотеатраANDY.ИдФильма<>M.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \\nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);"},{"title":"result","alias":"more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))","processed_query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM  Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  \\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \\n(SELECT DISTINCT * \\nFROM more_then_1 AS O\\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));"}]	[{"title":"more_then_1","alias":"Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N, ФильмыКинотеатры AS P ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"(((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.ИдКинотеатра = N.ИдКинотеатра AND Y.ИдФильма<> M.ИдФильма] ((N [N.ИдКинотеатра = P.ИдКинотеатра] P) [P.ИдФильма = M.ИдФильма] M))","description":"Кинотеатры, в которых идет более одного фильма","processed_query_body":"((X*Z*Y*N*P*M)[N.ИдКинотеатра=P.ИдКинотеатраANDP.ИдФильма=M.ИдФильмаANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.ИдФильма=Y.ИдФильмаANDX.ИдКинотеатра=N.ИдКинотеатраANDY.ИдФильма<>M.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \\nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);"},{"title":"result","alias":"more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))","processed_query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM  Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  \\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \\n(SELECT DISTINCT * \\nFROM more_then_1 AS O\\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));"}]	SELECT DISTINCT X.НазвКинотеатра, Y.Название  INTO TEMP more_then_1 \nFROM Фильмы AS Y, Кинотеатры AS X \nWHERE  EXISTS \n(SELECT * \nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);\n\nSELECT DISTINCT X.НазвКинотеатра, Y.Название \nFROM  Фильмы AS Y, Кинотеатры AS X \nWHERE  EXISTS \n(SELECT * \nFROM  \nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \n(SELECT DISTINCT * \nFROM more_then_1 AS O\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));	syntax error at or near "WHERE"	0	2019-06-11 10:24:17.653+03	2019-06-11 10:24:17.653+03	191	5	21
165	[{"title":"more_then_1","alias":"Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N, ФильмыКинотеатры AS P ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"(((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.ИдКинотеатра = N.ИдКинотеатра AND Y.ИдФильма<> M.ИдФильма] ((N [N.ИдКинотеатра = P.ИдКинотеатра] P) [P.ИдФильма = M.ИдФильма] M))","description":"Кинотеатры, в которых идет более одного фильма","processed_query_body":"((X*Z*Y*N*P*M)[N.ИдКинотеатра=P.ИдКинотеатраANDP.ИдФильма=M.ИдФильмаANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.ИдФильма=Y.ИдФильмаANDX.ИдКинотеатра=N.ИдКинотеатраANDY.ИдФильма<>M.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \\nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);"},{"title":"result","alias":"more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))","processed_query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM  Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  \\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \\n(SELECT DISTINCT * \\nFROM more_then_1 AS O\\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));"}]	[{"title":"more_then_1","alias":"Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N, ФильмыКинотеатры AS P ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"(((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.ИдКинотеатра = N.ИдКинотеатра AND Y.ИдФильма<> M.ИдФильма] ((N [N.ИдКинотеатра = P.ИдКинотеатра] P) [P.ИдФильма = M.ИдФильма] M))","description":"Кинотеатры, в которых идет более одного фильма","processed_query_body":"((X*Z*Y*N*P*M)[N.ИдКинотеатра=P.ИдКинотеатраANDP.ИдФильма=M.ИдФильмаANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.ИдФильма=Y.ИдФильмаANDX.ИдКинотеатра=N.ИдКинотеатраANDY.ИдФильма<>M.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \\nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);"},{"title":"result","alias":"more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))","processed_query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM  Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  \\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \\n(SELECT DISTINCT * \\nFROM more_then_1 AS O\\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));"}]	SELECT DISTINCT X.НазвКинотеатра, Y.Название  INTO TEMP more_then_1 \nFROM Фильмы AS Y, Кинотеатры AS X \nWHERE  EXISTS \n(SELECT * \nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);\n\nSELECT DISTINCT X.НазвКинотеатра, Y.Название \nFROM  Фильмы AS Y, Кинотеатры AS X \nWHERE  EXISTS \n(SELECT * \nFROM  \nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \n(SELECT DISTINCT * \nFROM more_then_1 AS O\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));	syntax error at or near "WHERE"	0	2019-06-11 10:24:35.189+03	2019-06-11 10:24:35.189+03	191	5	21
166	[{"title":"more_then_1","alias":"Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N, ФильмыКинотеатры AS P ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"(((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.ИдКинотеатра = N.ИдКинотеатра AND Y.ИдФильма<> M.ИдФильма] ((N [N.ИдКинотеатра = P.ИдКинотеатра] P) [P.ИдФильма = M.ИдФильма] M))","description":"Кинотеатры, в которых идет более одного фильма","processed_query_body":"((X*Z*Y*N*P*M)[N.ИдКинотеатра=P.ИдКинотеатраANDP.ИдФильма=M.ИдФильмаANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.ИдФильма=Y.ИдФильмаANDX.ИдКинотеатра=N.ИдКинотеатраANDY.ИдФильма<>M.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \\nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);"},{"title":"result","alias":"more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, Y.Название","query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))","processed_query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM  Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z \\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \\n(SELECT DISTINCT * \\nFROM more_then_1 AS O\\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));"}]	[{"title":"more_then_1","alias":"Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N, ФильмыКинотеатры AS P ","target_list":"X.НазвКинотеатра, Y.Название ","query_body":"(((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.ИдКинотеатра = N.ИдКинотеатра AND Y.ИдФильма<> M.ИдФильма] ((N [N.ИдКинотеатра = P.ИдКинотеатра] P) [P.ИдФильма = M.ИдФильма] M))","description":"Кинотеатры, в которых идет более одного фильма","processed_query_body":"((X*Z*Y*N*P*M)[N.ИдКинотеатра=P.ИдКинотеатраANDP.ИдФильма=M.ИдФильмаANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.ИдФильма=Y.ИдФильмаANDX.ИдКинотеатра=N.ИдКинотеатраANDY.ИдФильма<>M.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \\nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);"},{"title":"result","alias":"more_then_1 AS O, Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, Y.Название","query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))","processed_query_body":"((((X [X.ИдКинотеатра = Z.ИдКинотеатра] Z) [Z.ИдФильма = Y.ИдФильма] Y) [X.НазвКинотеатра, Y.Название])EXCEPT(O[O.НазвКинотеатра, O.Название]))","sql":"SELECT DISTINCT X.НазвКинотеатра, Y.Название \\nFROM  Фильмы AS Y, Кинотеатры AS X \\nWHERE  EXISTS \\n(SELECT * \\nFROM  ФильмыКинотеатры AS Z \\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \\n(SELECT DISTINCT * \\nFROM more_then_1 AS O\\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));"}]	SELECT DISTINCT X.НазвКинотеатра, Y.Название  INTO TEMP more_then_1 \nFROM Фильмы AS Y, Кинотеатры AS X \nWHERE  EXISTS \n(SELECT * \nFROM  ФильмыКинотеатры AS Z, Фильмы AS M, Кинотеатры AS N \nWHERE N.ИдКинотеатра=P.ИдКинотеатра AND P.ИдФильма=M.ИдФильма AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND X.ИдКинотеатра=N.ИдКинотеатра AND Y.ИдФильма<>M.ИдФильма);\n\nSELECT DISTINCT X.НазвКинотеатра, Y.Название \nFROM  Фильмы AS Y, Кинотеатры AS X \nWHERE  EXISTS \n(SELECT * \nFROM  ФильмыКинотеатры AS Z \nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND NOT EXISTS \n(SELECT DISTINCT * \nFROM more_then_1 AS O\nWHERE X.НазвКинотеатра=O.НазвКинотеатра AND Y.Название= O.Название));	missing FROM-clause entry for table "p"	0	2019-06-11 10:25:44.922+03	2019-06-11 10:25:44.922+03	191	5	21
167	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро='Университет']) [X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма]Y)","description":"Какие фильмы идут на станции метро Университет?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Университет'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDX.НомерСеанса=Z.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро='Университет']) [X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма]Y)","description":"Какие фильмы идут на станции метро Университет?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Университет'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDX.НомерСеанса=Z.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;		5	2019-06-11 10:27:09.607+03	2019-06-11 10:27:09.607+03	191	12	21
168	[{"title":"result","alias":"Фильмы AS X","target_list":"X.Год, X.Название","query_body":"X[X.Страна=\\"США\\"]","description":"Тестовый вопрос №1","processed_query_body":"X[X.Страна=\\"США\\"]","sql":"SELECT DISTINCT X.Год, X.Название \\nFROM Фильмы AS X \\nWHERE X.Страна='США';"}]	[{"title":"result","alias":"Фильмы AS X","target_list":"X.Год, X.Название","query_body":"X[X.Страна=\\"США\\"]","description":"Тестовый вопрос №1","processed_query_body":"X[X.Страна=\\"США\\"]","sql":"SELECT DISTINCT X.Год, X.Название \\nFROM Фильмы AS X \\nWHERE X.Страна='США';"}]	SELECT DISTINCT X.Год, X.Название \nFROM Фильмы AS X \nWHERE X.Страна='США';		5	2019-06-13 14:02:10.273+03	2019-06-13 14:02:10.273+03	192	13	21
169	[{"title":"result","alias":"Фильмы AS X","target_list":"X.Год, X.Название","query_body":"X[X.Страна=\\"США\\"]","description":"Тестовый вопрос №4(Россия)","processed_query_body":"X[X.Страна=\\"США\\"]","sql":"SELECT DISTINCT X.Год, X.Название \\nFROM Фильмы AS X \\nWHERE X.Страна='США';"}]	[{"title":"result","alias":"Фильмы AS X","target_list":"X.Год, X.Название","query_body":"X[X.Страна=\\"США\\"]","description":"Тестовый вопрос №4(Россия)","processed_query_body":"X[X.Страна=\\"США\\"]","sql":"SELECT DISTINCT X.Год, X.Название \\nFROM Фильмы AS X \\nWHERE X.Страна='США';"}]	SELECT DISTINCT X.Год, X.Название \nFROM Фильмы AS X \nWHERE X.Страна='США';	Количество строк в выборке данных, полученной в результате выполнения эталонного ответа, не совпало с количеством строк в выборке, полученной в результате выполнения SQL, который был сгенерирован из ответа на реляционной алгебре.	0	2019-06-13 14:03:23.894+03	2019-06-13 14:03:23.894+03	192	16	21
170	[{"title":"result","alias":"Фильмы AS X","target_list":"X.Год, X.Название","query_body":"X[X.Страна=\\"США\\"]","description":"Тестовый вопрос №1","processed_query_body":"X[X.Страна=\\"США\\"]","sql":"SELECT DISTINCT X.Год, X.Название \\nFROM Фильмы AS X \\nWHERE X.Страна='США';"}]	[{"title":"result","alias":"Фильмы AS X","target_list":"X.Год, X.Название","query_body":"X[X.Страна=\\"США\\"]","description":"Тестовый вопрос №1","processed_query_body":"X[X.Страна=\\"США\\"]","sql":"SELECT DISTINCT X.Год, X.Название \\nFROM Фильмы AS X \\nWHERE X.Страна='США';"}]	SELECT DISTINCT X.Год, X.Название \nFROM Фильмы AS X \nWHERE X.Страна='США';		5	2019-06-13 14:03:44.787+03	2019-06-13 14:03:44.787+03	192	13	21
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.roles (id, role, permissions, created, updated) FROM stdin;
2	teacher	{"Token":{"read":true,"create":true,"update":true,"delete":true},"Role":{"read":true,"create":true,"update":true,"delete":true},"User":{"read":true,"create":true,"update":true,"delete":true},"CheckPoint":{"read":true,"create":true,"update":true,"delete":true},"DataBase":{"read":true,"create":true,"update":true,"delete":true},"Table":{"read":true,"create":true,"update":true,"delete":true},"Question":{"read":true,"create":true,"update":true,"delete":true}}	2017-05-26 00:40:00+03	2017-05-26 00:40:00+03
1	root	{"Token":{"read":true,"create":true,"update":true,"delete":true},"Role":{"read":true,"create":true,"update":true,"delete":true},"User":{"read":true,"create":true,"update":true,"delete":true},"CheckPoint":{"read":true,"create":true,"update":true,"delete":true},"Database":{"read":true,"create":true,"update":true,"delete":true,"sql":true},"Table":{"read":true,"create":true,"update":true,"delete":true},"Question":{"read":true,"create":true,"update":true,"delete":true},"QuestionAnswer":{"read":true,"create":true,"update":true,"delete":true},"Group":{"read":true,"create":true,"update":true,"delete":true},"Student":{"read":true,"create":true,"update":true,"delete":true}}	2017-05-26 00:40:00.447+03	2017-05-26 00:40:00.447+03
3	student	{"Token":{"read":true,"create":true,"update":true,"delete":true},"Role":{"read":true,"create":true,"update":true,"delete":true},"User":{"read":true,"create":true,"update":true,"delete":true},"CheckPoint":{"read":true,"create":false,"update":false,"delete":false},"Database":{"read":true,"create":false,"update":false,"delete":false,"sql":false},"Table":{"read":true,"create":true,"update":true,"delete":true},"Question":{"read":true,"create":false,"update":false,"delete":false}, "QuestionAnswer":{"read":true,"create":true,"update":false,"delete":false},"Group":{"read":false,"create":false,"update":false,"delete":false},"Student":{"read":false,"create":false,"update":false,"delete":false}}	2017-05-26 00:40:00+03	2017-05-26 00:40:00+03
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.students (id, created, updated, group_id) FROM stdin;
1	2017-06-03 21:56:17.815+03	2017-06-03 21:56:17.815+03	7
2	2017-06-03 22:08:29.651+03	2017-06-03 22:08:29.651+03	7
3	2017-06-03 22:09:12.914+03	2017-06-03 22:09:12.914+03	7
4	2017-06-03 22:37:46.934+03	2017-06-03 22:37:46.934+03	1
5	2017-06-03 22:38:54.381+03	2017-06-03 22:38:54.381+03	1
6	2017-06-04 00:35:33.52+03	2017-06-04 00:35:33.52+03	1
7	2017-06-04 02:08:40.519+03	2017-06-04 02:08:40.519+03	1
8	2017-12-24 20:30:46.628+03	2017-12-24 20:30:46.628+03	7
9	2018-05-11 22:22:20.707+03	2018-05-11 22:22:20.707+03	8
12	2018-05-17 17:35:03.725+03	2018-05-17 17:35:03.725+03	8
13	2018-05-24 23:24:26.937+03	2018-05-24 23:24:26.937+03	8
14	2018-05-24 23:28:28.834+03	2018-05-24 23:28:28.834+03	8
15	2019-02-20 00:39:14.419+03	2019-02-20 00:39:14.419+03	11
16	2019-02-22 03:18:29.21+03	2019-02-22 03:18:29.21+03	11
17	2019-03-12 17:33:06.489+03	2019-03-12 17:33:06.489+03	11
18	2019-03-12 17:33:26.671+03	2019-03-12 17:33:26.671+03	11
\.


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.tables (id, title, created, updated, db_id) FROM stdin;
10	Кинотеатры	2017-05-26 00:45:27.043+03	2017-05-26 00:45:27.043+03	3
11	Актер	2017-05-26 00:45:27.043+03	2017-05-26 00:45:27.043+03	3
12	ФильмыАктер	2017-05-26 00:45:27.043+03	2017-05-26 00:45:27.043+03	3
13	Фильмы	2017-05-26 00:45:27.043+03	2017-05-26 00:45:27.043+03	3
14	ФильмыКинотеатры	2017-05-26 00:45:27.043+03	2017-05-26 00:45:27.043+03	3
1	Кинотеатры	2017-06-09 02:23:08.739+03	2017-06-09 02:23:08.739+03	2
2	Актер	2017-06-09 02:23:08.74+03	2017-06-09 02:23:08.74+03	2
3	ФильмыАктер	2017-06-09 02:23:08.74+03	2017-06-09 02:23:08.74+03	2
4	Фильмы	2017-06-09 02:23:08.741+03	2017-06-09 02:23:08.741+03	2
5	ФильмыКинотеатры	2017-06-09 02:23:08.741+03	2017-06-09 02:23:08.741+03	2
17	tab	2019-02-22 04:22:45.185+03	2019-02-22 04:22:45.185+03	19
\.


--
-- Data for Name: test_cases; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.test_cases (id, title, created, updated, check_point_id) FROM stdin;
184	Dynamic case	2019-06-11 10:20:18.942+03	2019-06-11 10:20:18.942+03	191
185	Dynamic case	2019-06-11 10:25:48.718+03	2019-06-11 10:25:48.718+03	191
186	Dynamic case	2019-06-13 13:59:58.68+03	2019-06-13 13:59:58.68+03	192
187	Вариант1	2019-06-13 15:18:08.286+03	2019-06-13 15:18:08.286+03	194
188	Вариант2	2019-06-13 15:18:08.287+03	2019-06-13 15:18:08.287+03	194
189	Вариант3	2019-06-13 15:18:08.287+03	2019-06-13 15:18:08.287+03	194
\.


--
-- Data for Name: test_cases_questions; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.test_cases_questions (id, created, updated, test_case_id, question_id) FROM stdin;
301	2019-06-13 15:18:08.295+03	2019-06-13 15:18:08.295+03	187	3
302	2019-06-13 15:18:08.297+03	2019-06-13 15:18:08.297+03	187	4
303	2019-06-13 15:18:08.297+03	2019-06-13 15:18:08.297+03	187	5
304	2019-06-13 15:18:08.305+03	2019-06-13 15:18:08.305+03	188	3
305	2019-06-13 15:18:08.305+03	2019-06-13 15:18:08.305+03	188	4
306	2019-06-13 15:18:08.305+03	2019-06-13 15:18:08.305+03	188	5
307	2019-06-13 15:18:08.316+03	2019-06-13 15:18:08.316+03	189	3
308	2019-06-13 15:18:08.317+03	2019-06-13 15:18:08.317+03	189	4
309	2019-06-13 15:18:08.317+03	2019-06-13 15:18:08.317+03	189	3
\.


--
-- Data for Name: tests_answers; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.tests_answers (id, start, "end", total_mark, "createdAt", "updatedAt", check_point_id, user_id, test_case_id) FROM stdin;
186	2019-06-11 10:25:48.725+03	\N	\N	2019-06-11 10:25:48.725+03	2019-06-11 10:27:09.648+03	191	21	185
185	2019-06-11 10:20:18.999+03	2019-06-11 10:27:09.779+03	10	2019-06-11 10:20:19.002+03	2019-06-11 10:27:09.78+03	191	21	184
187	2019-06-13 13:59:58.739+03	2019-06-13 14:03:44.878+03	10	2019-06-13 13:59:58.741+03	2019-06-13 14:03:44.879+03	192	21	186
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.tokens (id, token, created, updated, role_id, user_id) FROM stdin;
21	12df26e8-29fc-408c-9c7c-2b00e4b335f6	2017-06-10 12:10:03.625+03	2017-06-10 12:10:03.625+03	1	1
1	c6cc11a9-53e7-4e92-9d86-a9ee1da0e3e6	2017-05-26 00:40:39.082+03	2017-05-26 00:40:39.082+03	1	1
2	edbe105d-63d3-4192-a439-b8ae02dcd2cd	2017-05-26 00:40:42.414+03	2017-05-26 00:40:42.414+03	1	1
3	b749d24d-c486-4493-ae20-83c0db4b23cf	2017-05-26 00:41:11.088+03	2017-05-26 00:41:11.088+03	1	1
4	3eaef603-b765-4beb-8f18-4f08bb3a2fef	2017-05-27 05:05:50.539+03	2017-05-27 05:05:50.539+03	1	1
5	3d96a159-2a12-40db-8dbf-74514e802cc5	2017-06-02 14:13:07.949+03	2017-06-02 14:13:07.949+03	1	1
6	ab743325-3fbe-4db5-98c7-d147e76203b3	2017-06-03 05:10:53.004+03	2017-06-03 05:10:53.004+03	1	1
7	1c0624e2-3146-454b-9c41-1f3ccc1e1509	2017-06-04 02:06:04.766+03	2017-06-04 02:06:04.766+03	1	1
8	a726ab66-c3ca-4752-86f0-43cbde416ab0	2017-06-04 02:06:34.267+03	2017-06-04 02:06:34.267+03	1	1
9	a998fae8-446e-4d32-aba9-5a3f828b3b2b	2017-06-04 02:13:02.344+03	2017-06-04 02:13:02.344+03	3	10
10	5cbc6505-839c-4ba4-bd1a-17f48ab2d35a	2017-06-04 12:57:30.668+03	2017-06-04 12:57:30.668+03	1	1
11	676082ab-d8cc-4e41-b3c5-5ddd64260a17	2017-06-04 12:59:28.765+03	2017-06-04 12:59:28.765+03	3	10
12	737efedd-d754-40d7-b9d1-fbcd71e55298	2017-06-04 13:11:03.286+03	2017-06-04 13:11:03.286+03	1	1
13	28934ae4-e8f8-4020-9a4a-394dc0d3c041	2017-06-04 13:11:29.53+03	2017-06-04 13:11:29.53+03	3	10
14	664f5f37-65ca-4ca0-99a5-aa81b4c00b51	2017-06-05 00:38:43.487+03	2017-06-05 00:38:43.487+03	1	1
15	2a59d2df-488e-4173-bf09-63ffcb5e6b21	2017-06-05 00:53:59.297+03	2017-06-05 00:53:59.297+03	3	10
16	89d74ff8-59c9-4a5d-b784-ab34a81bb52c	2017-06-05 01:03:44.753+03	2017-06-05 01:03:44.753+03	1	1
17	8d019d44-c8ce-4135-bec1-4c2bad4508c4	2017-06-05 23:51:39.371+03	2017-06-05 23:51:39.371+03	3	10
18	6c2c3bc8-2468-4dca-a161-276509dd243d	2017-06-06 00:14:37.852+03	2017-06-06 00:14:37.852+03	1	1
19	9ac34668-1f61-4572-8da6-509041baace3	2017-06-08 23:33:49.096+03	2017-06-08 23:33:49.096+03	3	10
20	62e4f2e4-17f4-4c95-9216-336a3f2001a1	2017-06-09 00:06:33.487+03	2017-06-09 00:06:33.487+03	1	1
22	95180ce1-a761-4b3b-9bce-4caf8eaebe53	2017-06-10 12:14:06.01+03	2017-06-10 12:14:06.01+03	3	10
23	46eda62d-30ca-4638-ab5d-38ff17a76c3f	2017-07-09 12:58:04.072+03	2017-07-09 12:58:04.072+03	3	10
24	38bd0a81-d1ab-4dd7-aec9-dd8069073f5a	2017-07-09 13:22:13.914+03	2017-07-09 13:22:13.914+03	1	1
25	179b797f-7edd-473f-81c7-42d31cf643de	2017-07-09 14:42:04.551+03	2017-07-09 14:42:04.551+03	1	1
26	20752e17-bc1e-4950-b7fd-e45eb9514ee7	2017-07-09 14:45:40.039+03	2017-07-09 14:45:40.039+03	3	10
27	b461adba-a687-473e-8f3a-128a942a820f	2017-07-09 15:32:56.041+03	2017-07-09 15:32:56.041+03	1	1
28	b234ee04-070d-4bd8-9502-7347d99fed14	2017-07-09 16:59:54.349+03	2017-07-09 16:59:54.349+03	3	10
29	4bb43e3c-c870-45a0-a041-01cf5bf8b70b	2017-07-09 17:00:18.102+03	2017-07-09 17:00:18.102+03	1	1
30	cd2c398a-ad45-4355-929a-1c534ea3c8b6	2017-07-09 21:30:44.635+03	2017-07-09 21:30:44.635+03	3	10
31	aacbcd59-ac36-4c60-a838-e5e9ee21f109	2017-07-09 21:37:15.11+03	2017-07-09 21:37:15.11+03	3	10
32	f16b5445-055f-4199-ac9d-4f2f65a073d4	2017-07-09 21:37:35.169+03	2017-07-09 21:37:35.169+03	1	1
33	7ba246f0-999d-420b-9e2c-c84ae934219b	2017-08-27 18:45:22.239+03	2017-08-27 18:45:22.239+03	1	1
34	8bc8b392-b0a4-495c-bb2c-8fe16b34fa9a	2017-09-18 11:46:35.82+03	2017-09-18 11:46:35.82+03	1	1
35	b9f962da-0ef7-4880-bef4-333c93be7871	2017-09-18 13:18:44.584+03	2017-09-18 13:18:44.584+03	1	1
36	2ac81fd7-fa7a-4e17-9095-1b92917608f7	2017-09-20 17:25:02.709+03	2017-09-20 17:25:02.709+03	1	1
37	6b4af7b2-cab4-4208-a510-f3b1b25659c4	2017-10-03 15:12:53.246+03	2017-10-03 15:12:53.246+03	1	1
38	365e118b-b5d6-44f8-af7f-e9af25e492a7	2017-10-25 18:07:25.101+03	2017-10-25 18:07:25.101+03	1	1
39	ac8cf547-b1bf-4e5f-99d8-f3199bc8af5f	2017-11-13 15:14:14.862+03	2017-11-13 15:14:14.862+03	1	1
40	6d47b813-9449-41fe-a427-1da4f9f07c4c	2017-11-22 13:55:37.866+03	2017-11-22 13:55:37.866+03	1	1
41	5eda09cb-df20-4be1-af3e-a38e497211fc	2017-11-30 01:52:18.324+03	2017-11-30 01:52:18.324+03	1	1
42	a498fa23-839b-46f8-9e3e-9b1350b7074a	2017-12-09 15:34:27.378+03	2017-12-09 15:34:27.378+03	1	1
43	b734a494-5cbb-41eb-932c-7d325522f02d	2017-12-24 18:49:50.615+03	2017-12-24 18:49:50.615+03	1	1
44	2fe56506-4c32-4a69-99a2-b82659d5aec2	2017-12-24 20:31:36.45+03	2017-12-24 20:31:36.45+03	3	11
45	5c59930b-ba80-488e-bec3-f209996799e6	2017-12-24 20:33:40.608+03	2017-12-24 20:33:40.608+03	1	1
46	adce7691-5d30-4ff8-8de6-b56119c2d8f3	2017-12-24 20:41:27.379+03	2017-12-24 20:41:27.379+03	3	11
47	ef535cb6-caec-4375-8e3b-e773e3e6279d	2017-12-24 23:35:30.125+03	2017-12-24 23:35:30.125+03	1	1
48	fd1e6d66-eee9-4141-a012-dad8c191eeff	2017-12-24 23:37:17.374+03	2017-12-24 23:37:17.374+03	3	11
49	58fa1324-b520-4330-ae41-2c282017e6e3	2017-12-25 01:12:12.243+03	2017-12-25 01:12:12.243+03	1	1
50	2be4c268-5242-498e-b386-17cd3f13cbf6	2017-12-25 01:19:04.02+03	2017-12-25 01:19:04.02+03	3	11
51	11190110-1108-440e-aec0-ef32e7d25d33	2017-12-27 00:46:37.789+03	2017-12-27 00:46:37.789+03	1	1
52	2a44977a-f77f-4898-8c8c-302af2b8d2a9	2018-02-26 23:32:37.221+03	2018-02-26 23:32:37.221+03	1	1
53	ea072782-b4e5-4598-8d8a-d7b9d13776bb	2018-04-24 03:45:13.892+03	2018-04-24 03:45:13.892+03	1	1
54	391fccf4-d387-4cb8-96a5-283d1e032563	2018-05-07 16:29:04.077+03	2018-05-07 16:29:04.077+03	1	1
55	8ac5518b-6ae0-4e11-ac68-3f0923046a8d	2018-05-09 21:31:51.273+03	2018-05-09 21:31:51.273+03	1	1
56	94427339-f494-4acd-89b3-2c4bc172f273	2018-05-11 11:14:17.503+03	2018-05-11 11:14:17.503+03	1	1
57	15c7c1f2-d925-486a-af28-eadf278cefd8	2018-05-12 20:08:12.934+03	2018-05-12 20:08:12.934+03	3	12
58	8e93fe50-6c8b-4f70-be7c-ae321dd18743	2018-05-12 21:07:31.941+03	2018-05-12 21:07:31.941+03	3	12
59	e4decbcb-1e45-4606-a994-1c366e5e5dea	2018-05-12 21:07:42.312+03	2018-05-12 21:07:42.312+03	1	1
60	9a28cf93-747b-4a2e-acd7-55b69dd78cda	2018-05-21 14:28:25.057+03	2018-05-21 14:28:25.057+03	1	1
61	f3883b46-87e5-4b36-b371-cd1be4eee50e	2018-05-23 18:25:08.616+03	2018-05-23 18:25:08.616+03	3	12
62	a84b1643-322d-4e37-9bc9-7739031c13ba	2018-06-07 21:44:48.227+03	2018-06-07 21:44:48.227+03	1	1
63	5838561c-359e-44d8-9c43-c978c99fbd11	2018-06-07 21:46:44.275+03	2018-06-07 21:46:44.275+03	1	1
64	fc1838e6-529a-4681-b5b7-cc8939c7be83	2019-02-20 00:24:20.217+03	2019-02-20 00:24:20.217+03	1	1
65	7027f698-cc4e-4ead-9dfc-6662b0b206ef	2019-02-20 00:41:56.785+03	2019-02-20 00:41:56.785+03	3	20
66	a5b431ec-7e1c-4e24-a42e-9558c9369084	2019-02-20 01:06:23.008+03	2019-02-20 01:06:23.008+03	1	1
67	ba649686-f3bd-437f-9d1f-f688d1be1f5f	2019-02-20 01:09:05.835+03	2019-02-20 01:09:05.835+03	1	1
68	4ded0f13-a25a-49aa-8e83-90133db8d2f7	2019-02-20 09:21:23.025+03	2019-02-20 09:21:23.025+03	1	1
69	41108b22-f624-4975-8825-2b370162b662	2019-02-20 12:14:43.2+03	2019-02-20 12:14:43.2+03	1	1
70	b3f782cd-3042-49d6-93bd-b8501a79a28f	2019-02-20 19:06:36.216+03	2019-02-20 19:06:36.216+03	1	1
71	b0b5c61c-8b92-4939-89d5-f7fec1aad8c5	2019-02-22 03:13:51.613+03	2019-02-22 03:13:51.613+03	1	1
72	7be6381d-5e6e-42e5-8c3c-25a73eccca49	2019-02-22 03:22:54.89+03	2019-02-22 03:22:54.89+03	3	21
73	bfe6fcba-37e3-45ab-9466-dc46185f3e94	2019-02-26 21:13:47.545+03	2019-02-26 21:13:47.545+03	1	1
74	6e6a74d0-d87f-4498-9aed-434d75d3f6f2	2019-02-26 21:36:31.101+03	2019-02-26 21:36:31.101+03	1	1
75	a7e9151f-558d-4ef5-94c8-50bef2e7991c	2019-02-26 21:37:29.987+03	2019-02-26 21:37:29.987+03	3	21
76	068698a6-5def-489c-abe2-25d5d793b836	2019-02-26 21:47:05.595+03	2019-02-26 21:47:05.595+03	1	1
77	a19fa4f4-ddb9-41ba-9085-7c6cf5435f9b	2019-02-27 18:56:44.395+03	2019-02-27 18:56:44.395+03	1	1
78	6ad551cd-54d2-47aa-beec-461eb692c116	2019-02-27 19:04:23.098+03	2019-02-27 19:04:23.098+03	3	21
79	76a4f894-2c96-45cc-b985-db7a92d7cb5c	2019-02-27 19:14:22.7+03	2019-02-27 19:14:22.7+03	3	21
80	f6db1dcd-253f-45d4-89b8-e52bf2e0496e	2019-02-27 20:49:47.051+03	2019-02-27 20:49:47.051+03	1	1
81	84cbe771-853c-4291-97f0-5da512242c67	2019-03-04 13:01:27.553+03	2019-03-04 13:01:27.553+03	1	1
82	4ae36f8e-41e4-4630-aca5-fad5c41fa177	2019-03-04 20:31:39.836+03	2019-03-04 20:31:39.836+03	3	21
83	ca5fac79-a2d1-479e-aa30-054e6d985c47	2019-03-06 21:30:51.271+03	2019-03-06 21:30:51.271+03	1	1
84	190e0612-83c7-4c44-91f2-e5a242b1e5be	2019-03-06 21:52:18.141+03	2019-03-06 21:52:18.141+03	3	21
85	804fc92c-96b8-4a45-a0dc-222b98f7798a	2019-03-12 12:45:27.662+03	2019-03-12 12:45:27.662+03	1	1
86	b778fa46-00b6-4d8b-b574-8ad100cd9e11	2019-03-12 12:46:46.011+03	2019-03-12 12:46:46.011+03	3	21
87	9931a724-e3cd-4333-a59c-f67faab6f7d4	2019-03-12 13:04:54.338+03	2019-03-12 13:04:54.338+03	1	1
88	af57fc51-3577-4421-8df3-f7cd616854f1	2019-03-12 13:06:04.843+03	2019-03-12 13:06:04.843+03	3	21
89	4641dc51-7c35-4c3c-b3d4-430cfc921c84	2019-03-12 13:34:18.118+03	2019-03-12 13:34:18.118+03	1	1
90	963ca150-a5a0-4c32-9228-f724f41c5d2a	2019-03-12 13:35:26.906+03	2019-03-12 13:35:26.906+03	3	21
91	04d49ed1-311e-46fe-8de1-5208be95ca3d	2019-03-12 14:10:45.776+03	2019-03-12 14:10:45.776+03	3	21
92	47d5d12f-af69-4c72-a6d6-f0e8f269dcd4	2019-03-12 17:27:56.047+03	2019-03-12 17:27:56.047+03	1	1
93	e99a035a-e879-49d0-81aa-0562bc91e9a0	2019-03-12 17:29:37.583+03	2019-03-12 17:29:37.583+03	3	21
94	8073c039-e61d-4d79-92c3-9ff6feea4f6c	2019-03-12 17:31:50.265+03	2019-03-12 17:31:50.265+03	1	1
95	a1b0b79b-2b5f-4fc0-b066-e05eec0dd0c5	2019-03-12 17:33:53.708+03	2019-03-12 17:33:53.708+03	3	22
96	359e8d64-8d7f-440e-a968-7b08a65d3154	2019-03-12 17:40:53.452+03	2019-03-12 17:40:53.452+03	3	23
97	beff5ceb-c432-4cb3-bf14-019149424709	2019-03-12 17:44:12.783+03	2019-03-12 17:44:12.783+03	1	1
98	9b4f4875-73f5-4fa7-9694-f7c128d9ee1f	2019-03-12 18:13:59.692+03	2019-03-12 18:13:59.692+03	3	22
99	fb796e1a-c5bf-49a6-b16b-e847ca020e9b	2019-03-12 19:12:58.173+03	2019-03-12 19:12:58.173+03	3	22
100	f3523581-c8a6-47c1-add2-d8be4eb42d42	2019-03-12 19:32:51.319+03	2019-03-12 19:32:51.319+03	1	1
101	1956c978-2a24-4573-b49d-f7ecaf7511fb	2019-03-13 20:19:03.008+03	2019-03-13 20:19:03.008+03	3	21
102	5047ac33-acdd-4c47-af5a-c654bcf9ec9b	2019-03-15 13:12:41.621+03	2019-03-15 13:12:41.621+03	3	21
103	10fc28d6-883e-43bb-a209-012706288cbc	2019-04-03 16:07:46.374+03	2019-04-03 16:07:46.374+03	1	1
104	226cceb6-9a71-486d-b33e-e03e89027c7e	2019-04-03 16:09:24.257+03	2019-04-03 16:09:24.257+03	3	21
105	1da28da7-6482-4f38-bea2-e8891e255ef3	2019-04-05 20:07:03.355+03	2019-04-05 20:07:03.355+03	1	1
106	944777f9-bcc5-48f9-bb10-596012ff6420	2019-04-05 20:07:58.583+03	2019-04-05 20:07:58.583+03	3	21
107	2992a37c-2fe0-4572-9ce3-e95f06bbd86b	2019-04-05 20:09:46.808+03	2019-04-05 20:09:46.808+03	1	1
108	b32f4c32-103c-4a61-a41a-3c8c13074c16	2019-04-05 20:30:28.054+03	2019-04-05 20:30:28.054+03	1	1
109	3c6c5066-5aa4-45fe-84d5-c473f44fbceb	2019-04-05 20:30:40.742+03	2019-04-05 20:30:40.742+03	3	21
110	7d0205e6-b7a4-4ddf-b064-b3bf52d9e4b7	2019-04-05 20:30:54.646+03	2019-04-05 20:30:54.646+03	1	1
111	bb3fc966-f0db-4089-89e3-c54e3ee7c1a5	2019-04-05 20:32:24.939+03	2019-04-05 20:32:24.939+03	3	21
112	90cc7e75-605d-46b8-815e-dd761b14382a	2019-04-05 20:33:31.427+03	2019-04-05 20:33:31.427+03	1	1
113	d5fa1c55-2632-4cea-b903-3ccef17a7a83	2019-04-05 20:45:44.237+03	2019-04-05 20:45:44.237+03	3	21
114	a0ade7c7-f290-4216-acb5-88edd3c3c201	2019-04-08 15:21:47.454+03	2019-04-08 15:21:47.454+03	1	1
115	b495dacc-d9a9-4fbe-b232-4f6a7c72f8fd	2019-04-08 15:28:59.502+03	2019-04-08 15:28:59.502+03	3	22
116	9b97f3ca-497e-4ad9-8cce-3bac3824b292	2019-04-08 15:59:41.945+03	2019-04-08 15:59:41.945+03	1	1
117	f9668d1e-7ac1-4592-89cb-c236f685da06	2019-04-08 16:04:43.08+03	2019-04-08 16:04:43.08+03	3	21
118	701a9911-31a5-45f9-af72-57a87b9aa801	2019-05-19 18:14:50.649+03	2019-05-19 18:14:50.649+03	1	1
119	730756be-cad4-4273-91cb-9b164f3111b0	2019-05-19 18:23:34.993+03	2019-05-19 18:23:34.993+03	1	1
120	9ead22d1-af6a-4246-b6da-659fefbd8ffd	2019-06-11 09:58:18.757+03	2019-06-11 09:58:18.757+03	1	1
121	9ca8c381-070b-4c60-bf9f-2994d0f38f4f	2019-06-11 10:20:05.793+03	2019-06-11 10:20:05.793+03	3	21
122	60183de7-25a8-4a0b-8d8d-f5bdf5a6c317	2019-06-13 13:56:06.482+03	2019-06-13 13:56:06.482+03	1	1
123	ee1fcd3f-2260-4a51-a2db-631bce912a2e	2019-06-13 13:58:33.663+03	2019-06-13 13:58:33.663+03	3	21
124	628d13e5-348d-497c-8d70-45e2990ca444	2019-06-13 14:00:37.395+03	2019-06-13 14:00:37.395+03	1	1
125	a16b21d6-5dd8-4ba5-ae27-7abdf597cc4f	2019-06-13 14:30:26.936+03	2019-06-13 14:30:26.936+03	1	1
126	9849bb9c-505b-4829-827b-71a1b7fcbf03	2019-06-13 14:33:34.166+03	2019-06-13 14:33:34.166+03	3	21
127	877f95eb-ea90-49fb-937b-5c97be74dce9	2019-06-13 15:19:48.21+03	2019-06-13 15:19:48.21+03	1	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY public.users (id, name, email, phone, login, password, created, updated, student_id, role_id) FROM stdin;
1	\N	\N	\N	user	$2a$10$cGW2Zj.kD5OfaIHW49unbedNuB/GDR9xxH5tRhKhGWEaJk34aL/LW	2017-05-26 00:40:00.465+03	2017-05-26 00:40:00.465+03	\N	1
2	qwq	qwrr	qweq	qwrr	$2a$10$SC3eLoEJNypjV76XfSkYlOPcW/0N8ZKgXvD3k5Le3XgnP9WQlHEMK	2017-06-03 21:56:17.776+03	2017-06-03 21:56:17.776+03	\N	3
5	qwq	qwrr	qweq12312	123123	$2a$10$CaxMD7SVPVNkvNmUzstsnegCX/hIM7sdkJJKXZrdmG1imjQEESmxa	2017-06-03 22:08:29.64+03	2017-06-03 22:08:29.64+03	\N	3
6	qwq	qwrr	qweq12312	12312323	$2a$10$bXxWFJ3YXxaPjLEYHruQOexub4LxjhGTR0jPF9a3OG4Kjfz9qCuFy	2017-06-03 22:09:12.903+03	2017-06-03 22:09:12.903+03	\N	3
10	12	sweet_chery2010@mail.ru	89099730522	test	$2a$10$IMg/5Yp/pfB00/ht2mMssux2bjDHEUY75oAWHW/XsvFa/ZFvr/mwi	2017-06-04 02:08:40.516+03	2017-06-04 02:08:40.55+03	7	3
11	Павленко Дарья Александровна	da_rya_@mail.ru	89990012706	da_rya_	$2a$10$norfdrZ5bA791a/Dv77D5OxurDqIxDvX639qAtL0mpl.evG60wDni	2017-12-24 20:30:46.591+03	2017-12-24 20:30:46.647+03	8	3
12	Иванов Иван Иванович	ivan@gmail.com	89223071234	ivanov.ii	$2a$10$cUXGKFqUPucr8MBbHIlbuedzN0lWMzizpoE4Fh33FUvSjoT7ilYB6	2018-05-11 22:22:20.69+03	2018-05-11 22:22:20.719+03	9	3
19	Петров Васий Сергеевич	petrov.vs@mail.ru	89990090909	petrov.vs	$2a$10$g8KGHmiSLwJkxUG71QHc1uQzNJRDCAX7geHkVfIZRWj6c.FIqhnSC	2018-05-24 23:28:28.824+03	2018-05-24 23:28:28.843+03	14	3
20	Феофанов Кирилл Аркадьевич	lollol@kek.lu	88005553535	fka003	$2a$10$/v0UEAKE2lv3jxu/pPTztOL.2BR7PqWVWVwOrf5xEYTDhEP0OIIJC	2019-02-20 00:39:14.372+03	2019-02-20 00:39:14.461+03	15	3
21	Student	a@b.c	0	student	$2a$10$g9yoCNsT59EDr3q.VMzX7OyjO5ad4bTXGCpQ8p7fhXXBDq5zk4Su.	2019-02-22 03:18:29.15+03	2019-02-22 03:18:29.252+03	16	3
22	Test Student 2	olkjdd	123	stud1	$2a$10$CRMpXw2qrktQaKUh26BZw.oDhA53f3YuvS.QRpufiTUzim0A/TMLG	2019-03-12 17:33:06.416+03	2019-03-12 17:33:06.544+03	17	3
23	Test Student 3	olkjdd	123	stud2	$2a$10$47oZ5GcHRN3LI0BECQLif.QzfrxkCqhHycAvXyIL5QGVRLlpbPNT.	2019-03-12 17:33:26.64+03	2019-03-12 17:33:26.683+03	18	3
\.


--
-- Name: check_point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.check_point_id_seq', 1, false);


--
-- Name: check_points_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.check_points_groups_id_seq', 175, true);


--
-- Name: check_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.check_points_id_seq', 194, true);


--
-- Name: databases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.databases_id_seq', 19, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.groups_id_seq', 11, true);


--
-- Name: materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.materials_id_seq', 1, false);


--
-- Name: questions_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.questions_answers_id_seq', 170, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.questions_id_seq', 16, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.students_id_seq', 18, true);


--
-- Name: tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.tables_id_seq', 17, true);


--
-- Name: test_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.test_cases_id_seq', 189, true);


--
-- Name: test_cases_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.test_cases_questions_id_seq', 309, true);


--
-- Name: tests_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.tests_answers_id_seq', 187, true);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.tokens_id_seq', 127, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: check_point check_point_date_from_key; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_point
    ADD CONSTRAINT check_point_date_from_key UNIQUE (date_from);


--
-- Name: check_point check_point_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_point
    ADD CONSTRAINT check_point_pkey PRIMARY KEY (id);


--
-- Name: check_points_groups check_points_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points_groups
    ADD CONSTRAINT check_points_groups_pkey PRIMARY KEY (id);


--
-- Name: check_points check_points_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points
    ADD CONSTRAINT check_points_pkey PRIMARY KEY (id);


--
-- Name: databases databases_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.databases
    ADD CONSTRAINT databases_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: questions_answers questions_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions_answers
    ADD CONSTRAINT questions_answers_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_key; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_key UNIQUE (role);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: test_cases test_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (id);


--
-- Name: test_cases_questions test_cases_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases_questions
    ADD CONSTRAINT test_cases_questions_pkey PRIMARY KEY (id);


--
-- Name: tests_answers tests_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tests_answers
    ADD CONSTRAINT tests_answers_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_token_key UNIQUE (token);


--
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: token_roleid_index; Type: INDEX; Schema: public; Owner: converter
--

CREATE INDEX token_roleid_index ON public.tokens USING btree (role_id);


--
-- Name: check_point check_point_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_point
    ADD CONSTRAINT check_point_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: check_points_groups check_points_groups_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points_groups
    ADD CONSTRAINT check_points_groups_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES public.check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_points_groups check_points_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points_groups
    ADD CONSTRAINT check_points_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE;


--
-- Name: check_points check_points_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.check_points
    ADD CONSTRAINT check_points_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: databases databases_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.databases
    ADD CONSTRAINT databases_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: questions_answers questions_answers_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions_answers
    ADD CONSTRAINT questions_answers_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES public.check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions_answers questions_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions_answers
    ADD CONSTRAINT questions_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions_answers questions_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions_answers
    ADD CONSTRAINT questions_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: questions questions_db_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_db_id_fkey FOREIGN KEY (db_id) REFERENCES public.databases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions questions_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: students students_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tables tables_db_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_db_id_fkey FOREIGN KEY (db_id) REFERENCES public.databases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_cases test_cases_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES public.check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_cases_questions test_cases_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases_questions
    ADD CONSTRAINT test_cases_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE CASCADE;


--
-- Name: test_cases_questions test_cases_questions_test_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.test_cases_questions
    ADD CONSTRAINT test_cases_questions_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_cases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_answers tests_answers_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tests_answers
    ADD CONSTRAINT tests_answers_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES public.check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_answers tests_answers_test_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tests_answers
    ADD CONSTRAINT tests_answers_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_cases(id) ON UPDATE CASCADE;


--
-- Name: tests_answers tests_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tests_answers
    ADD CONSTRAINT tests_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: tokens tokens_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tokens tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE;


--
-- Name: users users_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

