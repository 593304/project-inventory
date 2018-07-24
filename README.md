# Project Inventory

This is a hobby project with embedded webserver and in-memory database using **Spring Boot** and **H2 Databse**

## Table of Contents

* [Description](#description)
* [Usage](#usage)
* [Changelog](#changelog)
  * [Version-0.3.0](#version-030)
  * [Version-0.4.0](#version-040)
  * [Version-0.5.0](#version-050)
  * [Version-0.5.5](#version-055)
  * [Version-0.5.8](#version-058)
  * [Version-0.6.0](#version-060)
  * [Version-0.6.7](#version-067)
  * [Version-0.7.2](#version-072)
  * [Version-0.8.5](#version-085)
  * [Version-0.8.7](#version-087)
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

### Version-0.5.8

Fixed scrollbars in modals, but need to fix them when resizing window.

### Version-0.6.0

Added the basics of working times. Now can add, edit or delete worktimes.

### Version-0.6.7

Cleaned java and javascript codes. Checked existing functionality. Added Profile entity for worktime export.

### Version-0.7.2

Worktime export modal and working time list modal for project added to the frontend. Some fixes. Missing the export business logic.

### Version-0.8.5

Modified project entity and added project manager and service manager to the class. Refactored the connected classes and codes. Now the user is able to export the worktimes if a worktime contains a project.

### Version-0.8.7

Added a new export functionality.

## ToDo

- [ ] Scrollable modals
- [ ] Scrollable modals after window resize
- [x] Projects
   - [x] Worktime list
- [x] Notes
   - [x] Comments
- [x] Working times
   - [x] ICS export
   - [x] CSV export
- [ ] Front-end fixes for smaller resolutions
- [ ] Search
- [ ] Error handling