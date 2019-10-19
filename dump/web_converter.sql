--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: enum_check_points_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_check_points_type AS ENUM (
    'test',
    'exam',
    'attestation'
);


ALTER TYPE enum_check_points_type OWNER TO converter;

--
-- Name: enum_database_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_database_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE enum_database_type OWNER TO converter;

--
-- Name: enum_databases_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_databases_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE enum_databases_type OWNER TO converter;

--
-- Name: enum_question_db_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_question_db_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE enum_question_db_type OWNER TO converter;

--
-- Name: enum_question_query_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_question_query_type AS ENUM (
    'RA',
    'TC'
);


ALTER TYPE enum_question_query_type OWNER TO converter;

--
-- Name: enum_questions_db_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_questions_db_type AS ENUM (
    'test',
    'prepare',
    'common',
    'private'
);


ALTER TYPE enum_questions_db_type OWNER TO converter;

--
-- Name: enum_questions_query_type; Type: TYPE; Schema: public; Owner: converter
--

CREATE TYPE enum_questions_query_type AS ENUM (
    'RA',
    'TC'
);


ALTER TYPE enum_questions_query_type OWNER TO converter;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: check_point; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE check_point (
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


ALTER TABLE check_point OWNER TO converter;

--
-- Name: check_point_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE check_point_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE check_point_id_seq OWNER TO converter;

--
-- Name: check_point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE check_point_id_seq OWNED BY check_point.id;


--
-- Name: check_points; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE check_points (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type enum_check_points_type NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    description text,
    test_config json,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE check_points OWNER TO converter;

--
-- Name: check_points_groups; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE check_points_groups (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    check_point_id integer,
    group_id integer NOT NULL
);


ALTER TABLE check_points_groups OWNER TO converter;

--
-- Name: check_points_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE check_points_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE check_points_groups_id_seq OWNER TO converter;

--
-- Name: check_points_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE check_points_groups_id_seq OWNED BY check_points_groups.id;


--
-- Name: check_points_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE check_points_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE check_points_id_seq OWNER TO converter;

--
-- Name: check_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE check_points_id_seq OWNED BY check_points.id;


--
-- Name: databases; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE databases (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    type enum_databases_type NOT NULL,
    note character varying(255),
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE databases OWNER TO converter;

--
-- Name: databases_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE databases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE databases_id_seq OWNER TO converter;

--
-- Name: databases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE databases_id_seq OWNED BY databases.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE groups (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    department character varying(255),
    specialty character varying(255),
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE groups OWNER TO converter;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_id_seq OWNER TO converter;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE groups_id_seq OWNED BY groups.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE questions (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    tag character varying(255),
    query_type enum_questions_query_type NOT NULL,
    complexity integer NOT NULL,
    text text NOT NULL,
    sql_answer text NOT NULL,
    help character varying(255),
    last_using timestamp with time zone,
    db_type enum_questions_db_type NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    db_id integer NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE questions OWNER TO converter;

--
-- Name: questions_answers; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE questions_answers (
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


ALTER TABLE questions_answers OWNER TO converter;

--
-- Name: questions_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE questions_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE questions_answers_id_seq OWNER TO converter;

--
-- Name: questions_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE questions_answers_id_seq OWNED BY questions_answers.id;


--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE questions_id_seq OWNER TO converter;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE questions_id_seq OWNED BY questions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE roles (
    id integer NOT NULL,
    role character varying(255) NOT NULL,
    permissions json NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL
);


ALTER TABLE roles OWNER TO converter;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE roles_id_seq OWNER TO converter;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE students (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE students OWNER TO converter;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE students_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE students_id_seq OWNER TO converter;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE students_id_seq OWNED BY students.id;


--
-- Name: tables; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE tables (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    db_id integer NOT NULL
);


ALTER TABLE tables OWNER TO converter;

--
-- Name: tables_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE tables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tables_id_seq OWNER TO converter;

--
-- Name: tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE tables_id_seq OWNED BY tables.id;


--
-- Name: test_cases; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE test_cases (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    check_point_id integer
);


ALTER TABLE test_cases OWNER TO converter;

--
-- Name: test_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE test_cases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_cases_id_seq OWNER TO converter;

--
-- Name: test_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE test_cases_id_seq OWNED BY test_cases.id;


--
-- Name: test_cases_questions; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE test_cases_questions (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    test_case_id integer,
    question_id integer NOT NULL
);


ALTER TABLE test_cases_questions OWNER TO converter;

--
-- Name: test_cases_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE test_cases_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_cases_questions_id_seq OWNER TO converter;

--
-- Name: test_cases_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE test_cases_questions_id_seq OWNED BY test_cases_questions.id;


--
-- Name: tests_answers; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE tests_answers (
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


ALTER TABLE tests_answers OWNER TO converter;

--
-- Name: tests_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE tests_answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tests_answers_id_seq OWNER TO converter;

--
-- Name: tests_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE tests_answers_id_seq OWNED BY tests_answers.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE tokens (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    created timestamp with time zone NOT NULL,
    updated timestamp with time zone NOT NULL,
    role_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE tokens OWNER TO converter;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tokens_id_seq OWNER TO converter;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE tokens_id_seq OWNED BY tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE users (
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


ALTER TABLE users OWNER TO converter;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: converter
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO converter;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: converter
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_point ALTER COLUMN id SET DEFAULT nextval('check_point_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_points ALTER COLUMN id SET DEFAULT nextval('check_points_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_points_groups ALTER COLUMN id SET DEFAULT nextval('check_points_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY databases ALTER COLUMN id SET DEFAULT nextval('databases_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions ALTER COLUMN id SET DEFAULT nextval('questions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions_answers ALTER COLUMN id SET DEFAULT nextval('questions_answers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY students ALTER COLUMN id SET DEFAULT nextval('students_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tables ALTER COLUMN id SET DEFAULT nextval('tables_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY test_cases ALTER COLUMN id SET DEFAULT nextval('test_cases_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY test_cases_questions ALTER COLUMN id SET DEFAULT nextval('test_cases_questions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tests_answers ALTER COLUMN id SET DEFAULT nextval('tests_answers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tokens ALTER COLUMN id SET DEFAULT nextval('tokens_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: converter
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: check_point; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY check_point (id, title, type, date_from, date_to, url, created, updated, owner_id) FROM stdin;
\.


--
-- Name: check_point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('check_point_id_seq', 1, false);


--
-- Data for Name: check_points; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY check_points (id, title, type, start, "end", description, test_config, created, updated, owner_id) FROM stdin;
9	test	exam	2017-06-14 03:00:00+03	2017-06-15 03:00:00+03	\N	\N	2017-06-07 23:28:34.934+03	2017-06-07 23:28:34.934+03	1
10	rt	attestation	2017-06-15 03:00:00+03	2017-06-16 03:00:00+03	\N	\N	2017-06-08 00:28:35.522+03	2017-06-08 00:28:35.522+03	1
11	w	exam	2017-06-15 03:00:00+03	2017-06-16 03:00:00+03	\N	\N	2017-06-08 00:31:23.467+03	2017-06-08 00:31:23.467+03	1
12	er	exam	2017-06-15 00:00:00+03	2017-06-16 00:00:00+03	\N	\N	2017-06-08 00:35:36.11+03	2017-06-08 00:35:36.11+03	1
13	test12	attestation	2017-06-15 00:00:00+03	2017-06-16 00:00:00+03	\N	\N	2017-06-08 00:39:38.151+03	2017-06-08 00:39:38.151+03	1
14	re	exam	2017-06-15 00:00:00+03	2017-06-16 00:00:00+03	\N	\N	2017-06-08 02:18:25.218+03	2017-06-08 02:18:25.218+03	1
17	1	exam	2017-06-15 00:00:00+03	2017-06-16 00:00:00+03	\N	\N	2017-06-08 02:55:51.428+03	2017-06-08 02:55:51.428+03	1
18	Общий экзамен	exam	2017-06-16 00:00:00+03	2017-06-17 00:00:00+03	\N	\N	2017-06-09 00:10:07.544+03	2017-06-09 00:10:07.544+03	1
19	Зачет общий	attestation	2017-06-16 00:00:00+03	2017-06-17 00:00:00+03	\N	\N	2017-06-09 00:13:21.139+03	2017-06-09 00:13:21.139+03	1
20	Пересдача	attestation	2017-06-23 09:00:00+03	2017-06-17 00:00:00+03	\N	\N	2017-06-09 00:25:01.451+03	2017-06-09 00:25:01.451+03	1
21	Текущая кр	test	2017-06-10 00:00:00+03	2017-06-18 00:00:00+03	\N	{"test_cases_amount":"1","questions_amount":"4","mean_complexity":"3"}	2017-06-10 12:13:42.284+03	2017-06-10 12:13:42.284+03	1
22	Тест1	test	2017-07-16 00:00:00+03	2017-07-17 00:00:00+03	\N	{"time_limit":"on","minutes_amount":"60","test_cases_amount":"1","questions_amount":"3","mean_complexity":"3"}	2017-07-09 13:23:22.031+03	2017-07-09 13:23:22.031+03	1
\.


--
-- Data for Name: check_points_groups; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY check_points_groups (id, created, updated, check_point_id, group_id) FROM stdin;
3	2017-06-08 02:55:51.445+03	2017-06-08 02:55:51.445+03	17	1
4	2017-06-09 00:10:07.556+03	2017-06-09 00:10:07.556+03	18	7
5	2017-06-09 00:10:07.557+03	2017-06-09 00:10:07.557+03	18	1
6	2017-06-09 00:13:21.145+03	2017-06-09 00:13:21.145+03	19	7
7	2017-06-09 00:13:21.146+03	2017-06-09 00:13:21.146+03	19	1
8	2017-06-09 00:25:01.463+03	2017-06-09 00:25:01.463+03	20	7
9	2017-06-09 00:25:01.463+03	2017-06-09 00:25:01.463+03	20	1
10	2017-06-10 12:13:42.296+03	2017-06-10 12:13:42.296+03	21	7
11	2017-06-10 12:13:42.296+03	2017-06-10 12:13:42.296+03	21	1
12	2017-07-09 13:23:22.06+03	2017-07-09 13:23:22.06+03	22	1
\.


--
-- Name: check_points_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('check_points_groups_id_seq', 12, true);


--
-- Name: check_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('check_points_id_seq', 22, true);


--
-- Data for Name: databases; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY databases (id, title, description, type, note, created, updated, owner_id) FROM stdin;
3	Kino_1	база данных актеров кино и кинотеатров	prepare	экспорт из файла TestFull_One	2017-05-26 00:45:27.032+03	2017-05-26 00:45:27.032+03	1
20	ewwetretre	ert	test	r	2017-05-27 02:30:12.27+03	2017-05-27 02:30:12.27+03	1
2	Kino_for_tests	база данных кинотеатров и фильмов	common		2017-06-09 02:23:08.679+03	2017-06-09 02:23:08.679+03	1
\.


--
-- Name: databases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('databases_id_seq', 2, true);


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY groups (id, title, department, specialty, created, updated) FROM stdin;
7	К05-224	22		2017-06-02 15:59:42.889+03	2017-06-02 15:59:42.889+03
1	М15-505	223		2017-06-02 14:13:43.057+03	2017-06-03 02:28:03.703+03
\.


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('groups_id_seq', 7, true);


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY questions (id, title, tag, query_type, complexity, text, sql_answer, help, last_using, db_type, created, updated, db_id, owner_id) FROM stdin;
1	1		RA	2	qwwe	SELECT * FROM Фильмы;		\N	test	2017-06-05 00:39:42.658+03	2017-06-05 00:39:42.658+03	20	1
2	Фильмы на метро Университет		RA	2	Какие фильмы идут на станции метро Университет?\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	prepare	2017-06-05 00:39:59.199+03	2017-06-05 23:50:10.727+03	3	1
3	Фильмы на метро Университет		RA	2	Какие фильмы идут на станции метро Университет?\r\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Университет';		\N	common	2017-06-09 02:48:30.49+03	2017-06-09 02:48:30.49+03	2	1
4	Фильмы на метро Коломенская		RA	2	Какие фильмы идут на станции метро Коломенская?\r\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета\r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND X.Метро = 'Коломенская';		\N	common	2017-06-09 02:59:48.145+03	2017-06-09 02:59:48.145+03	2	1
5	Один фильм		RA	4	В каких кинотеатрах идет только один фильм ?\r\nОтвет(НазвКинотеатра, Название(Фильма))	SELECT DISTINCT X. НазвКинотеатра, Y.Название \r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z \r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND NOT EXISTS \r\n(SELECT * FROM Фильмы AS Y1, Кинотеатры AS X1, ФильмыКинотеатры AS Z1 \r\nWHERE X1.ИдКинотеатра=Z1.ИдКинотеатра AND Z1.ИдФильма=Y1.ИдФильма AND X.ИдКинотеатра=X1.ИдКинотеатра AND Y.ИдФильма<>Y1.ИдФильма);		\N	common	2017-06-09 03:00:36.739+03	2017-06-09 03:00:36.739+03	2	1
6	Два фильма		RA	5	В каких кинотеатрах идут два фильма ?\r\nОтвет(НазвКинотеатра, Название(Фильма))\r\n	SELECT DISTINCT X. НазвКинотеатра, Y.Название \r\nFROM Фильмы AS Y, Кинотеатры AS X, ФильмыКинотеатры AS Z, Фильмы AS Y1, Кинотеатры AS X1, ФильмыКинотеатры AS Z1\r\nWHERE X.ИдКинотеатра=Z.ИдКинотеатра AND Z.ИдФильма=Y.ИдФильма AND Z.НомерСеанса=X.НомерСеанса AND Y.ИдФильма<>Y1.ИдФильма AND X1.ИдКинотеатра=Z1.ИдКинотеатра AND Z1.ИдФильма=Y1.ИдФильма AND X.ИдКинотеатра=X1.ИдКинотеатра AND Y.ИдФильма<>Y1.ИдФильма AND NOT EXISTS \r\n(SELECT * FROM Фильмы AS Y2, Кинотеатры AS X2, ФильмыКинотеатры AS Z2 \r\nWHERE X2.ИдКинотеатра=Z2.ИдКинотеатра AND Z2.ИдФильма=Y2.ИдФильма AND X.ИдКинотеатра=X2.ИдКинотеатра AND Y.ИдФильма<>Y2.ИдФильма AND Y1.ИдФильма<>Y2.ИдФильма);		\N	common	2017-06-09 03:01:59.042+03	2017-06-09 03:01:59.042+03	2	1
\.


--
-- Data for Name: questions_answers; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY questions_answers (id, answer, processed_answer, sql, error, mark, created, updated, check_point_id, question_id, user_id) FROM stdin;
1	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро = 'Университет'])\\n[X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма] Y)","description":"Какие фильмы идут на станции метро Университет?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)"}]	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро = 'Университет'])\\n[X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма] Y)","description":"Какие фильмы идут на станции метро Университет?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"( ( X * Z * Y ) [ X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеансаANDZ.ИдФильма=Y.ИдФильма ] )","sql":"SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	SELECT DISTINCT X. НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;		5	2017-06-06 00:12:32.741+03	2017-06-06 00:12:32.741+03	\N	2	10
2	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро = 'Университет']) [X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма] Y)","description":"Какие фильмы идут на станции метро Коломенская?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Университет'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.НомерСеанса=X.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро = 'Университет']) [X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма] Y)","description":"Какие фильмы идут на станции метро Коломенская?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Университет'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.НомерСеанса=X.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;	Количество строк в выборке данных, полученной в результате выполнения эталонного ответа, не совпало с количеством строк в выборке, полученной в результате выполнения SQL, который был сгенерирован из ответа на реляционной алгебре.	0	2017-06-10 12:32:04.636+03	2017-06-10 12:32:04.636+03	\N	4	10
3	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро = 'Коломенская']) [X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма] Y)","description":"Какие фильмы идут на станции метро Коломенская?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Коломенская'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.НомерСеанса=X.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Коломенская' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро = 'Коломенская']) [X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса] Z) [Z.ИдФильма=Y.ИдФильма] Y)","description":"Какие фильмы идут на станции метро Коломенская?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Коломенская'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDZ.НомерСеанса=X.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Коломенская' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \nWHERE X.Метро='Коломенская' AND X.ИдКинотеатра=Z.ИдКинотеатра AND Z.НомерСеанса=X.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;		5	2017-06-10 12:34:41.347+03	2017-06-10 12:34:41.347+03	21	4	10
4	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"-","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))"}]	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"-","description":"В каких кинотеатрах идет только один фильм ?\\nОтвет(НазвКинотеатра, Название(Фильма))"}]	Не удалось выполнить генерацию SQL.	После эквивалентных преобразований запрос не соответсвует необходимому шаблону	0	2017-06-10 12:46:43.632+03	2017-06-10 12:46:43.632+03	21	5	10
5	[{"title":"result","alias":"-","target_list":"-","query_body":"-","description":"В каких кинотеатрах идут два фильма ?\\nОтвет(НазвКинотеатра, Название(Фильма))\\n"}]	[{"title":"result","alias":"-","target_list":"-","query_body":"-","description":"В каких кинотеатрах идут два фильма ?\\nОтвет(НазвКинотеатра, Название(Фильма))\\n"}]	Не удалось выполнить генерацию SQL.	После эквивалентных преобразований запрос не соответсвует необходимому шаблону	0	2017-06-10 14:07:38.038+03	2017-06-10 14:07:38.038+03	21	6	10
6	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро='Университет'])[X.ИдКинотеатра=Z.ИдКинотеатраANDX.НомерСеанса=Z.НомерСеанса]Z)[Z.ИдФильма=Y.ИдФильма]Y)","description":"Какие фильмы идут на станции метро Университет?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Университет'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDX.НомерСеанса=Z.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	[{"title":"result","alias":"Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z","target_list":"X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета","query_body":"(((X[X.Метро='Университет'])[X.ИдКинотеатра=Z.ИдКинотеатраANDX.НомерСеанса=Z.НомерСеанса]Z)[Z.ИдФильма=Y.ИдФильма]Y)","description":"Какие фильмы идут на станции метро Университет?\\nОтвет  (НазвКтнотеатра, Метро, Название(Фильма), ЦенаБилета)","processed_query_body":"((X*Z*Y)[X.Метро='Университет'ANDX.ИдКинотеатра=Z.ИдКинотеатраANDX.НомерСеанса=Z.НомерСеансаANDZ.ИдФильма=Y.ИдФильма])","sql":"SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \\nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \\nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;"}]	SELECT DISTINCT X.НазвКинотеатра, X.Метро, Y.Название, Z.ЦенаБилета \nFROM Кинотеатры AS X, Фильмы AS Y, ФильмыКинотеатры AS Z \nWHERE X.Метро='Университет' AND X.ИдКинотеатра=Z.ИдКинотеатра AND X.НомерСеанса=Z.НомерСеанса AND Z.ИдФильма=Y.ИдФильма;		5	2017-06-10 14:12:22.659+03	2017-06-10 14:12:22.659+03	21	3	10
\.


--
-- Name: questions_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('questions_answers_id_seq', 6, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('questions_id_seq', 6, true);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY roles (id, role, permissions, created, updated) FROM stdin;
2	teacher	{"Token":{"read":true,"create":true,"update":true,"delete":true},"Role":{"read":true,"create":true,"update":true,"delete":true},"User":{"read":true,"create":true,"update":true,"delete":true},"CheckPoint":{"read":true,"create":true,"update":true,"delete":true},"DataBase":{"read":true,"create":true,"update":true,"delete":true},"Table":{"read":true,"create":true,"update":true,"delete":true},"Question":{"read":true,"create":true,"update":true,"delete":true}}	2017-05-26 00:40:00+03	2017-05-26 00:40:00+03
1	root	{"Token":{"read":true,"create":true,"update":true,"delete":true},"Role":{"read":true,"create":true,"update":true,"delete":true},"User":{"read":true,"create":true,"update":true,"delete":true},"CheckPoint":{"read":true,"create":true,"update":true,"delete":true},"Database":{"read":true,"create":true,"update":true,"delete":true,"sql":true},"Table":{"read":true,"create":true,"update":true,"delete":true},"Question":{"read":true,"create":true,"update":true,"delete":true},"QuestionAnswer":{"read":true,"create":true,"update":true,"delete":true},"Group":{"read":true,"create":true,"update":true,"delete":true},"Student":{"read":true,"create":true,"update":true,"delete":true}}	2017-05-26 00:40:00.447+03	2017-05-26 00:40:00.447+03
3	student	{"Token":{"read":true,"create":true,"update":true,"delete":true},"Role":{"read":true,"create":true,"update":true,"delete":true},"User":{"read":true,"create":true,"update":true,"delete":true},"CheckPoint":{"read":true,"create":false,"update":false,"delete":false},"Database":{"read":true,"create":false,"update":false,"delete":false,"sql":false},"Table":{"read":true,"create":true,"update":true,"delete":true},"Question":{"read":true,"create":false,"update":false,"delete":false}, "QuestionAnswer":{"read":true,"create":true,"update":false,"delete":false},"Group":{"read":false,"create":false,"update":false,"delete":false},"Student":{"read":false,"create":false,"update":false,"delete":false}}	2017-05-26 00:40:00+03	2017-05-26 00:40:00+03
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('roles_id_seq', 1, true);


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY students (id, created, updated, group_id) FROM stdin;
1	2017-06-03 21:56:17.815+03	2017-06-03 21:56:17.815+03	7
2	2017-06-03 22:08:29.651+03	2017-06-03 22:08:29.651+03	7
3	2017-06-03 22:09:12.914+03	2017-06-03 22:09:12.914+03	7
4	2017-06-03 22:37:46.934+03	2017-06-03 22:37:46.934+03	1
5	2017-06-03 22:38:54.381+03	2017-06-03 22:38:54.381+03	1
6	2017-06-04 00:35:33.52+03	2017-06-04 00:35:33.52+03	1
7	2017-06-04 02:08:40.519+03	2017-06-04 02:08:40.519+03	1
\.


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('students_id_seq', 7, true);


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY tables (id, title, created, updated, db_id) FROM stdin;
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
95	Кинотеатры	2017-05-27 02:30:12.281+03	2017-05-27 02:30:12.281+03	20
96	Актер	2017-05-27 02:30:12.282+03	2017-05-27 02:30:12.282+03	20
97	ФильмыАктер	2017-05-27 02:30:12.282+03	2017-05-27 02:30:12.282+03	20
98	Фильмы	2017-05-27 02:30:12.282+03	2017-05-27 02:30:12.282+03	20
99	ФильмыКинотеатры	2017-05-27 02:30:12.282+03	2017-05-27 02:30:12.282+03	20
\.


--
-- Name: tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('tables_id_seq', 5, true);


--
-- Data for Name: test_cases; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY test_cases (id, title, created, updated, check_point_id) FROM stdin;
1	Вариант1	2017-06-10 12:13:42.303+03	2017-06-10 12:13:42.303+03	21
2	Вариант1	2017-07-09 13:23:22.065+03	2017-07-09 13:23:22.065+03	22
\.


--
-- Name: test_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('test_cases_id_seq', 2, true);


--
-- Data for Name: test_cases_questions; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY test_cases_questions (id, created, updated, test_case_id, question_id) FROM stdin;
1	2017-06-10 12:13:42.306+03	2017-06-10 12:13:42.306+03	1	6
2	2017-06-10 12:13:42.306+03	2017-06-10 12:13:42.306+03	1	5
3	2017-06-10 12:13:42.306+03	2017-06-10 12:13:42.306+03	1	4
4	2017-06-10 12:13:42.306+03	2017-06-10 12:13:42.306+03	1	3
5	2017-07-09 13:23:22.067+03	2017-07-09 13:23:22.067+03	2	3
6	2017-07-09 13:23:22.067+03	2017-07-09 13:23:22.067+03	2	4
7	2017-07-09 13:23:22.068+03	2017-07-09 13:23:22.068+03	2	5
\.


--
-- Name: test_cases_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('test_cases_questions_id_seq', 7, true);


--
-- Data for Name: tests_answers; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY tests_answers (id, start, "end", total_mark, "createdAt", "updatedAt", check_point_id, user_id, test_case_id) FROM stdin;
1	2017-06-10 12:14:26.582+03	2017-06-10 14:49:11.406+03	\N	2017-06-10 12:14:26.583+03	2017-06-10 14:49:11.407+03	21	10	1
\.


--
-- Name: tests_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('tests_answers_id_seq', 1, true);


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY tokens (id, token, created, updated, role_id, user_id) FROM stdin;
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
\.


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('tokens_id_seq', 36, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY users (id, name, email, phone, login, password, created, updated, student_id, role_id) FROM stdin;
1	\N	\N	\N	user	$2a$10$cGW2Zj.kD5OfaIHW49unbedNuB/GDR9xxH5tRhKhGWEaJk34aL/LW	2017-05-26 00:40:00.465+03	2017-05-26 00:40:00.465+03	\N	1
2	qwq	qwrr	qweq	qwrr	$2a$10$SC3eLoEJNypjV76XfSkYlOPcW/0N8ZKgXvD3k5Le3XgnP9WQlHEMK	2017-06-03 21:56:17.776+03	2017-06-03 21:56:17.776+03	\N	3
5	qwq	qwrr	qweq12312	123123	$2a$10$CaxMD7SVPVNkvNmUzstsnegCX/hIM7sdkJJKXZrdmG1imjQEESmxa	2017-06-03 22:08:29.64+03	2017-06-03 22:08:29.64+03	\N	3
6	qwq	qwrr	qweq12312	12312323	$2a$10$bXxWFJ3YXxaPjLEYHruQOexub4LxjhGTR0jPF9a3OG4Kjfz9qCuFy	2017-06-03 22:09:12.903+03	2017-06-03 22:09:12.903+03	\N	3
9	Петровская Анастасия Викторовна	sweet_chery2010@mail.ru	89099730522	user_anastasia	$2a$10$7wfzA.Zs7oJWOPJupAXnqexTJbuzyiNiGxkF9xfawIYhcUUQNg4Km	2017-06-04 00:35:33.51+03	2017-06-04 00:35:33.552+03	6	3
10	12	sweet_chery2010@mail.ru	89099730522	test	$2a$10$IMg/5Yp/pfB00/ht2mMssux2bjDHEUY75oAWHW/XsvFa/ZFvr/mwi	2017-06-04 02:08:40.516+03	2017-06-04 02:08:40.55+03	7	3
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: converter
--

SELECT pg_catalog.setval('users_id_seq', 10, true);


--
-- Name: check_point_date_from_key; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY check_point
    ADD CONSTRAINT check_point_date_from_key UNIQUE (date_from);


--
-- Name: check_point_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY check_point
    ADD CONSTRAINT check_point_pkey PRIMARY KEY (id);


--
-- Name: check_points_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY check_points_groups
    ADD CONSTRAINT check_points_groups_pkey PRIMARY KEY (id);


--
-- Name: check_points_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY check_points
    ADD CONSTRAINT check_points_pkey PRIMARY KEY (id);


--
-- Name: databases_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY databases
    ADD CONSTRAINT databases_pkey PRIMARY KEY (id);


--
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: questions_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY questions_answers
    ADD CONSTRAINT questions_answers_pkey PRIMARY KEY (id);


--
-- Name: questions_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles_role_key; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_role_key UNIQUE (role);


--
-- Name: students_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: tables_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: test_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (id);


--
-- Name: test_cases_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY test_cases_questions
    ADD CONSTRAINT test_cases_questions_pkey PRIMARY KEY (id);


--
-- Name: tests_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY tests_answers
    ADD CONSTRAINT tests_answers_pkey PRIMARY KEY (id);


--
-- Name: tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_token_key UNIQUE (token);


--
-- Name: users_login_key; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: token_roleid_index; Type: INDEX; Schema: public; Owner: converter; Tablespace: 
--

CREATE INDEX token_roleid_index ON tokens USING btree (role_id);


--
-- Name: check_point_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_point
    ADD CONSTRAINT check_point_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: check_points_groups_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_points_groups
    ADD CONSTRAINT check_points_groups_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_points_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_points_groups
    ADD CONSTRAINT check_points_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE;


--
-- Name: check_points_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY check_points
    ADD CONSTRAINT check_points_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: databases_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY databases
    ADD CONSTRAINT databases_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: questions_answers_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions_answers
    ADD CONSTRAINT questions_answers_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions_answers
    ADD CONSTRAINT questions_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions_answers
    ADD CONSTRAINT questions_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: questions_db_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions
    ADD CONSTRAINT questions_db_id_fkey FOREIGN KEY (db_id) REFERENCES databases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY questions
    ADD CONSTRAINT questions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: students_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY students
    ADD CONSTRAINT students_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tables_db_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tables
    ADD CONSTRAINT tables_db_id_fkey FOREIGN KEY (db_id) REFERENCES databases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_cases_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY test_cases
    ADD CONSTRAINT test_cases_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_cases_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY test_cases_questions
    ADD CONSTRAINT test_cases_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(id) ON UPDATE CASCADE;


--
-- Name: test_cases_questions_test_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY test_cases_questions
    ADD CONSTRAINT test_cases_questions_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_answers_check_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tests_answers
    ADD CONSTRAINT tests_answers_check_point_id_fkey FOREIGN KEY (check_point_id) REFERENCES check_points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests_answers_test_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tests_answers
    ADD CONSTRAINT tests_answers_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES test_cases(id) ON UPDATE CASCADE;


--
-- Name: tests_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tests_answers
    ADD CONSTRAINT tests_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: tokens_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;


--
-- Name: users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE;


--
-- Name: users_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

