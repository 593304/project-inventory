# Project Inventory

This is a hobby project with embedded webserver and in-memory database using **Spring Boot** and **H2 Databse**

## Table of Contents

* [Description](#description)
* [Usage](#usage)
* [Changelog](#changelog)
  * [Version-0.3.0](#version-0.3.0)
  * [Version-0.4.0](#version-0.4.0)
  * [Version-0.5.0](#version-0.5.0)
  * [Version-0.5.5](#version-0.5.5)
* [ToDo](#todo)

## Description

With this application You can manage your clients and projects. You can add contacts with basic information and You're able to add contacts for clients. It's possible to export a contacts information as a vCard. For projects You can store notes and working times. The working time is also exportable as an ics file. The H2 database using file based data storing.

> The application optimized for Chrome browsers and HD+ resolution.

## Usage

The application.properties file holds the necessary configurations. You can set the port and the name for the embedded servlet. You should set the H2 database file absolute or relative path.

## Changelog

### Version-0.3.0

Runnable version with embedded servlet and in-memory database with the necessary config for Spring MVC, Servlet and DB. You can add, edit or remove clients and projects~~, the modifications will be stored in the given JSON file~~.

### Version-0.4.0

Extended the project with contact information and fixed client - project on-to-many relationship. So in this version You're able to delete a client without deleting theirs projects or contacts. You can download contact information as a vCard.

### Version-0.5.0

Added every tab to the frontend. Added notes to manage project informations A note is a collections of comments for a specific date. There are some problems with adding notes to the DB at startup.

### Version-0.5.5

Upgraded to Spring Boot version 2.0.3 and changed JSON based database storing to H2 file based database storing. Added description field for worktime.

## ToDo

- [ ] Scrollable modals
- [ ] Notes
   - [ ] Comments
- [ ] Working times
- [ ] Working times ics export
- [ ] Front-end fixes for smaller resolutions
- [ ] Search