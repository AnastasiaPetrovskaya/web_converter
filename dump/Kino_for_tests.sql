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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Актер; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE "Актер" (
    "ИдАктера" character varying(10) NOT NULL,
    "Имя" character varying(100),
    "ДатаРождения" timestamp without time zone
);


ALTER TABLE "Актер" OWNER TO converter;

--
-- Name: Кинотеатры; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE "Кинотеатры" (
    "ИдКинотеатра" character varying(10) NOT NULL,
    "НомерСеанса" integer NOT NULL,
    "НазвКинотеатра" text,
    "Метро" text
);


ALTER TABLE "Кинотеатры" OWNER TO converter;

--
-- Name: Фильмы; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE "Фильмы" (
    "ИдФильма" character varying(10) NOT NULL,
    "Название" text,
    "Страна" text,
    "Год" character varying(510),
    "Режиссер" text
);


ALTER TABLE "Фильмы" OWNER TO converter;

--
-- Name: ФильмыАктер; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE "ФильмыАктер" (
    "ИдАктера" character varying(10) NOT NULL,
    "ИдФильма" character varying(10) NOT NULL,
    "Премия" text
);


ALTER TABLE "ФильмыАктер" OWNER TO converter;

--
-- Name: ФильмыКинотеатры; Type: TABLE; Schema: public; Owner: converter; Tablespace: 
--

CREATE TABLE "ФильмыКинотеатры" (
    "ИдКинотеатра" character varying(10) NOT NULL,
    "НомерСеанса" integer NOT NULL,
    "ИдФильма" character varying(10) NOT NULL,
    "ЦенаБилета" numeric(15,2)
);


ALTER TABLE "ФильмыКинотеатры" OWNER TO converter;

--
-- Data for Name: Актер; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY "Актер" ("ИдАктера", "Имя", "ДатаРождения") FROM stdin;
А_01	Арнольд Шварцнегер	1947-07-30 00:00:00
А_02	Сами Насери	1961-07-02 00:00:00
А_03	Байрам Северджан	1946-09-11 00:00:00
А_04	Вин Дизель	1967-07-18 00:00:00
А_05	Скарлетт Йоханссон	1984-11-22 00:00:00
А_06	Юрий Яковлев	1928-04-25 00:00:00
А_07	Леонид Куравлев	1936-10-08 00:00:00
\.


--
-- Data for Name: Кинотеатры; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY "Кинотеатры" ("ИдКинотеатра", "НомерСеанса", "НазвКинотеатра", "Метро") FROM stdin;
К_01	1	Орбита	Коломенская
К_01	2	Орбита	Коломенская
К_02	1	Ударник	Кропоткинская
К_02	2	Ударник	Кропоткинская
К_03	1	Формула Кино	Университет
К_03	2	Формула Кино	Университет
К_03	3	Формула Кино	Университет
К_04	1	Гудзон	Варшавская
К_05	1	Радуга кино	Технопарк
К_06	1	Мечта	Технопарк
\.


--
-- Data for Name: Фильмы; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY "Фильмы" ("ИдФильма", "Название", "Страна", "Год", "Режиссер") FROM stdin;
Ф_01	Терминатор 1	США	1984	Джеймс Кэмерон
Ф_02	ТАКСИ 4	Франция	2007	Жерар Кравчик
Ф_03	Черная кошка белый кот	Югославия	1998	Эмир Кустурица
Ф_04	Форсаж 1	США	2001	Роб Коэн 
Ф_05	Люси	Франция	2014	Люк Бессон
Ф_06	Иван Васильевич меняет профессию	СССР	1973	Леонид Гайдай
\.


--
-- Data for Name: ФильмыАктер; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY "ФильмыАктер" ("ИдАктера", "ИдФильма", "Премия") FROM stdin;
А_01	Ф_01	American Cinematheque Award
А_02	Ф_02	Премия «Сезар»
А_03	Ф_01	No
А_03	Ф_03	No
А_04	Ф_04	Кинонаграда MTV за самый зрелищный эпизод
А_05	Ф_01	No
А_05	Ф_05	Премия BAFTA в номинации «Лучшая женская роль»
А_06	Ф_06	«Артист» премия 2013г
А_07	Ф_06	«Артист» премия 2013г
\.


--
-- Data for Name: ФильмыКинотеатры; Type: TABLE DATA; Schema: public; Owner: converter
--

COPY "ФильмыКинотеатры" ("ИдКинотеатра", "НомерСеанса", "ИдФильма", "ЦенаБилета") FROM stdin;
К_01	1	Ф_01	150.00
К_01	2	Ф_01	280.00
К_02	1	Ф_03	300.00
К_02	2	Ф_01	200.00
К_03	1	Ф_05	350.00
К_03	2	Ф_06	200.00
К_03	3	Ф_03	100.00
К_04	1	Ф_04	100.00
К_05	1	Ф_02	350.00
К_06	1	Ф_06	200.00
\.


--
-- Name: Актер_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY "Актер"
    ADD CONSTRAINT "Актер_pkey" PRIMARY KEY ("ИдАктера");


--
-- Name: Кинотеатры_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY "Кинотеатры"
    ADD CONSTRAINT "Кинотеатры_pkey" PRIMARY KEY ("ИдКинотеатра", "НомерСеанса");


--
-- Name: Фильмы_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY "Фильмы"
    ADD CONSTRAINT "Фильмы_pkey" PRIMARY KEY ("ИдФильма");


--
-- Name: ФильмыАктер_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY "ФильмыАктер"
    ADD CONSTRAINT "ФильмыАктер_pkey" PRIMARY KEY ("ИдАктера", "ИдФильма");


--
-- Name: ФильмыКинотеатры_pkey; Type: CONSTRAINT; Schema: public; Owner: converter; Tablespace: 
--

ALTER TABLE ONLY "ФильмыКинотеатры"
    ADD CONSTRAINT "ФильмыКинотеатры_pkey" PRIMARY KEY ("ИдКинотеатра", "НомерСеанса", "ИдФильма");


--
-- Name: Кинотеатры_КинотератыИдКинотеатр; Type: INDEX; Schema: public; Owner: converter; Tablespace: 
--

CREATE INDEX "Кинотеатры_КинотератыИдКинотеатр" ON "Кинотеатры" USING btree ("ИдКинотеатра");


--
-- Name: ФильмыАктер_ИдАктера_fk; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY "ФильмыАктер"
    ADD CONSTRAINT "ФильмыАктер_ИдАктера_fk" FOREIGN KEY ("ИдАктера") REFERENCES "Актер"("ИдАктера");


--
-- Name: ФильмыАктер_ИдФильма_fk; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY "ФильмыАктер"
    ADD CONSTRAINT "ФильмыАктер_ИдФильма_fk" FOREIGN KEY ("ИдФильма") REFERENCES "Фильмы"("ИдФильма");


--
-- Name: ФильмыКинотеатры_ИдФильма_fk; Type: FK CONSTRAINT; Schema: public; Owner: converter
--

ALTER TABLE ONLY "ФильмыКинотеатры"
    ADD CONSTRAINT "ФильмыКинотеатры_ИдФильма_fk" FOREIGN KEY ("ИдФильма") REFERENCES "Фильмы"("ИдФильма");


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

