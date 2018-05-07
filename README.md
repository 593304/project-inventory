# Project Inventory

This is a hobby project with embedded webserver and in-memory database using **Spring Boot** and **H2 Databse**

## Table of Contents

* [Description](#description)
* [Usage](#usage)
* [Changelog](#changelog)
  * [Version-0.3.0](#version-0.3.0)
  * [Version-0.4.0](#version-0.4.0)
* [ToDo](#todo)

## Description

With this application You can manage your clients and projects. At startup the application loads the content of a JSON file into the database and every modification saved to that file for permanent storing. You can add contacts with basic information and You're able to add contacts for clients. It's possible to export a contacts information as a vCard. For projects You can store notes and working times. The working time is also exportable as an ics file.

> The application optimized for Chrome browsers and HD+ resolution.

## Usage

The application.properties file holds the necessary configurations. You can set the port and the name for the embedded servlet. You should add a JSON file with absolute or relative path.

## Changelog

### Version-0.3.0

Runnable version with embedded servlet and in-memory database with the necessary config for Spring MVC, Servlet and DB. You can add, edit or remove clients and projects, the modifications will be stored in the given JSON file.

### Version-0.4.0

Extended the project with contact information and fixed client - project on-to-many relationship. So in this version You're able to delete a client without deleting theirs projects or contacts. You can download contact information as a vCard.

## ToDo

- [ ] Notes
- [ ] Working times
- [ ] Working times ics export
- [ ] Front-end fixes for smaller resolutions
- [ ] Search