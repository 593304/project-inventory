var projectInventory = {};

projectInventory.logger = (function() {
    var moduleName = 'projectInventory.logger',

    DEBUG = 'DEBUG', INFO = 'INFO', ERROR = 'ERROR',

    timeColor = 'font-weight: normal; color: gray;',
    debugColor = 'font-weight: bold; color: blue;',
    infoColor = 'font-weight: bold; color: green;',
    errorColor = 'font-weight: bold; color: red;',
    messageColor = 'font-weight: normal; color: black;',

    defaultLevel = DEBUG,

    compareToLogLevel = function(level) {
        if(defaultLevel == DEBUG) {
            if(level != DEBUG)
                return 1;
            else
                return 0;
        }

        if(defaultLevel == INFO) {
            if(level == DEBUG)
                return -1;
            else if(level == INFO)
                return 0;
            else
                return 1;
        }

        if(defaultLevel == ERROR) {
            if(level != ERROR)
                return -1;
            else
                return 0;
        }
    },

    date = function() {
        var d = new Date();
        var year = d.getFullYear().toString();
        var month = (d.getMonth() + 1).toString();
        var day = d.getDate().toString();
        var hour = d.getHours().toString();
        var minute = d.getMinutes().toString();
        var second = d.getSeconds().toString();
        var msecond = d.getMilliseconds().toString();

        month = '0'.repeat(2 - month.length) + month;
        day = '0'.repeat(2 - day.length) + day;
        hour = '0'.repeat(2 - hour.length) + hour;
        minute = '0'.repeat(2 - minute.length) + minute;
        second = '0'.repeat(2 - second.length) + second;
        msecond = '0'.repeat(3 - msecond.length) + msecond;

        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + msecond;
    },

    log = function(myLevel, functionName, message) {
        if(compareToLogLevel(myLevel) == -1)
            return;

        var levelColor;
        var levelString;

        if(myLevel.length < 6)
            levelString = ' '.repeat(6 - myLevel.length) + myLevel;
        else
            levelString = myLevel;

        switch(myLevel) {
            case DEBUG:
                levelColor = debugColor;
                break;
            case INFO:
                levelColor =infoColor;
                break;
            case ERROR:
                levelColor = errorColor;
                break;
            default:
                levelColor = messageColor;
                break;
        }

        if(functionName.length < 65)
            functionName = functionName + ' '.repeat(65 - functionName.length);

        console.log('%c%s - %c[%s] %s %c: %s',
            timeColor, date(),
            levelColor, levelString, functionName,
            messageColor, message);
    };

    return {
        debug : function(functionName, message) {
            log(DEBUG, functionName, message);
        },

        info : function(functionName, message) {
            log(INFO, functionName, message);
        },

        error : function(functionName, message) {
            log(ERROR, functionName, message);
        },

        getDefaultLevel : defaultLevel,

        setDefaultLevel : function(level) {
            var functionName = moduleName + '.setDefaultLevel';

            switch(level) {
                case DEBUG:
                case INFO:
                case ERROR:
                    defaultLevel = level;
                    this.info(functionName, 'The new default log level is ' + level);
                    break;
                default:
                    this.error(functionName, 'Cannot set default log level to ' + level + ' please try again with one of these: ' + DEBUG + ', ' + INFO + ', ' + ERROR);
                    break;
            }
        }
    };
}());

var logger = projectInventory.logger;

projectInventory.app = (function() {
    var moduleName = 'projectInventory.app',

    _appPath = '/project-inventory',

    tabNames = {
        left : {
            PROJECT : 'PROJECT',
            NOTE : 'NOTE',
            WORKTIME : 'WORKTIME'
        },
        right : {
            CLIENT : 'CLIENT',
            CONTACT: 'CONTACT'
        }
    },

    sectionSelectors = {
        PROJECT : '#projectSection',
        NOTE : '#noteSection',
        WORKTIME : '#worktimeSection',
        CLIENT : '#clientSection',
        CONTACT : '#contactSection'
    },

    _defaultTabs = {
        left : tabNames.left.PROJECT,
        right : tabNames.right.CLIENT
    },
        
    cachedVariables = {
        activeTabs : {
            left : '',
            right : ''
        }
    },
        
    updateBrowserCache = function() {
        var appName = _appPath.replace('/', '');
        
        localStorage[appName] = JSON.stringify(cachedVariables);
    },
        
    _updateActiveTab = function(side, tabName) {
        var functionName = moduleName + '.updateActiveTab';

        if(Object.keys(_defaultTabs).indexOf(side) == -1) {
            logger.error(functionName, 'Wrong side param, use one of these: ' + Object.keys(_defaultTabs));
            return;
        }

        if(Object.keys(tabNames[side]).indexOf(tabName) == -1) {
            logger.info(functionName, 'Wrong tab name, using the default one(' + _defaultTabs[side] + ') from the this list: ' + tabNames[side]);
            tabName = _defaultTabs[side];
        }

        cachedVariables.activeTabs[side] = tabName;
        
        updateBrowserCache();
    },

    parseCache = function() {
        var functionName = moduleName + '.parseCache';

        var appName = _appPath.replace('/', '');
        var cache = localStorage[appName] ? JSON.parse(localStorage[appName]) : {};

        if(cache.length == 0) {
            logger.info(functionName, 'No cached variables found, using default tabs: ' + JSON.stringify(_defaultTabs));

            cachedVariables.activeTabs.left = _defaultTabs.left;
            cachedVariables.activeTabs.right = _defaultTabs.right;
        } else if(cache.activeTabs == null || cache.activeTabs.length == 0) {
            logger.info(functionName, 'No active tabs cached, using default tabs: ' + JSON.stringify(_defaultTabs));

            cachedVariables.activeTabs.left = _defaultTabs.left;
            cachedVariables.activeTabs.right = _defaultTabs.right;
        } else {
            if (cache.activeTabs.left == null || cache.activeTabs.left.length == 0 || tabNames.left[cache.activeTabs.left] == null) {
                logger.info(functionName, 'Something wrong with the left tab, using default one: ' + JSON.stringify(_defaultTabs.left));

                cachedVariables.activeTabs.left = _defaultTabs.left;
            }
            if (cache.activeTabs.right == null || cache.activeTabs.right.length == 0 || tabNames.right[cache.activeTabs.right] == null) {
                logger.info(functionName, 'Something wrong with the right tab, using default one: ' + JSON.stringify(_defaultTabs.right));

                cachedVariables.activeTabs.right = _defaultTabs.right;
            }
        }

        if(cachedVariables.activeTabs.left.length == 0)
            cachedVariables.activeTabs.left = cache.activeTabs.left;
        if(cachedVariables.activeTabs.right.length == 0)
            cachedVariables.activeTabs.right = cache.activeTabs.right;

        updateBrowserCache();
    },

    _init = function() {
        var functionName = moduleName + ".init";

        logger.info(functionName, 'Page loaded, running initialization ...');
        logger.info(functionName, 'The default log level is: ' + logger.getDefaultLevel);
        logger.info(functionName, 'The application path is: ' + _appPath);

        /*
          Place of other init functions
         */
        parseCache();
        $(sectionSelectors[cachedVariables.activeTabs.left]).removeClass('hidden');
        $(sectionSelectors[cachedVariables.activeTabs.right]).removeClass('hidden');

        logger.info(functionName, 'Page loaded, initialization finished');
    };

    return {
        appPath : _appPath,
        getTabNames : function() { return tabNames },
        updateActiveTab : _updateActiveTab,

        init : _init
    };
}());

projectInventory.module = {};

projectInventory.module.modal = (function() {
    var

    _show = function(modalName, enableScrolling) {
        $(modalName).removeClass('hidden');

        if(enableScrolling) {
            var height = $(window).height() * 0.7 - 30;

            if(height < $(modalName + ' .modal-window').height()) {
                $(modalName + ' .modal-window').addClass('scroll');
                $(modalName + ' .modal-content').addClass('scroll');
                $(modalName + ' .modal-button').addClass('scroll');
            }
        }
    },

    _hide = function(modalName, disableScrolling) {
        $(modalName).addClass('hidden');

        if(disableScrolling) {
            $(modalName + ' .modal-window').removeClass('scroll');
            $(modalName + ' .modal-content').removeClass('scroll');
            $(modalName + ' .modal-button').removeClass('scroll');
        }
    };

    return {
        show : _show,
        hide : _hide
    };
}());

projectInventory.module.client = (function() {
    var moduleName = 'projectInventory.module.client',

    selectors = {
        clientSection : '#clientSection',
        contactSection : '#contactSection',
        clientAdd : '#clientAdd',
        listProjects : '#listProjects',
        listContacts : '#listContacts',
        clientEdit : '#clientEdit',
        client : '#client-',
        deleteModal : '#deleteModal'
    },

    elements = {
        emptyProjectListRow : '<tr><td colspan="4">No projects found for this client</td></tr>',
        errorProjectListRow : '<tr><td colspan="4">Cannot retrieve project list for this client</td></tr>',
        projectListRow : '<tr><td>{name}</td><td>{code}</td><td>{status}</td><td>{priority}</td></tr>',
        emptyContactListRow : '<tr><td colspan="5">No contacts found for this client</td></tr>',
        errorContactListRow : '<tr><td colspan="5">Cannot retrieve contact list for this client</td></tr>',
        contactListRow : '<tr><td>{firstname}</td><td>{lastname}</td><td>{mail}</td><td>{phone}</td><td>{address}</td></tr>'
    },

    _showSection = function() {
        var functionName = moduleName + '.showSection';
        logger.debug(functionName, 'Opening client section');

        $(selectors.clientSection).removeClass('hidden');
        $(selectors.contactSection).addClass('hidden');

        projectInventory.app.updateActiveTab('right', projectInventory.app.getTabNames().right.CLIENT);
    },

    _showAdd = function() {
        var functionName = moduleName + '.showAdd';
        logger.debug(functionName, 'Opening add client modal');

        $(selectors.clientAdd).removeClass('hidden');
    },

    _hideAdd = function() {
        var functionName = moduleName + '.hideAdd';
        logger.debug(functionName, 'Closing add client modal');

        $(selectors.clientAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add client modal');

        $(selectors.clientAdd).addClass('hidden');
        $(selectors.clientAdd + ' input').val('');
    },

    _showEdit = function(id) {
        var functionName = moduleName + '.showEdit';
        logger.debug(functionName, 'Opening edit client modal');
        logger.info(functionName, "Setting form values for edit client modal");

        $(selectors.clientEdit + ' .id').val(id);
        $(selectors.clientEdit + ' .name').val($(selectors.client + id + ' .name').html());
        $(selectors.clientEdit + ' .alias').val($(selectors.client + id + ' .alias').html());

        $(selectors.clientEdit).removeClass('hidden');
    },

    _hideEdit = function() {
        var functionName = moduleName + '.hideEdit';
        logger.debug(functionName, 'Closing edit client modal');

        $(selectors.clientEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for edit client modal');

        $(selectors.clientEdit).addClass('hidden');
        $(selectors.clientEdit + ' input').val('');
    },

    _showDelete = function(id, name) {
        var functionName = moduleName + '.showDelete';
        logger.debug(functionName, 'Opening delete client modal');

        logger.info(functionName, 'Client selected for delete: [ ' + id + ', ' + name + ' ]');

        $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/clients/delete/' + id);
        $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.client.hideDelete()');
        $(selectors.deleteModal).removeClass('hidden');
    },

    _hideDelete = function() {
        var functionName = moduleName + '.hideDelete';
        logger.debug(functionName, 'Closing delete client modal');

        $(selectors.deleteModal).addClass('hidden');
        $(selectors.deleteModal + ' :button').attr('onclick', '');
    },

    getProjects = function(id) {
        var functionName = moduleName + '.getProjects';
        logger.debug(functionName, 'Getting project list for client');

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + '/projects/list/' + id)
                .done(function(data) {
                    logger.info(functionName, 'Found projects: ' + JSON.stringify(data));
                    resolve(data);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showProjects = function(id) {
        var functionName = moduleName + '.showProjects';
        logger.debug(functionName, 'Opening project list modal');

        getProjects(id).then(
            function(projects) {
                if(projects.length == 0) {
                    logger.info(functionName, "No projects found for client: " + id);

                    $(selectors.listProjects + ' tbody').append(elements.emptyProjectListRow);
                } else {
                    logger.info(functionName, "Adding projects to the project list modal");

                    $(projects).each(function() {
                        $(selectors.listProjects + ' tbody').append(
                            elements.projectListRow
                                .replace('{name}', this.name)
                                .replace('{code}', this.code)
                                .replace('{status}', this.status)
                                .replace('{priority}', this.priority)
                        );
                    });
                }
            },
            function() {
                logger.error(functionName, 'Opening modal with error message');

                $(selectors.listProjects + ' tbody').append(elements.errorProjectListRow);
            });

        $(selectors.listProjects).removeClass('hidden');
    },

    _hideProjects = function() {
        var functionName = moduleName + '.hideProjects';
        logger.debug(functionName, 'Closing project list modal');

        $(selectors.listProjects).addClass('hidden');

        logger.info(functionName, 'Removing table rows from project list modal');

        $(selectors.listProjects + ' tbody').html('');
    },

    getContacts = function(id) {
        var functionName = moduleName + '.getContacts';
        logger.debug(functionName, 'Getting contact list for client');

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + '/contacts/list/' + id)
                .done(function(data) {
                    logger.info(functionName, 'Found contacts: ' + JSON.stringify(data));
                    resolve(data);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showContacts = function(id) {
        var functionName = moduleName + '.showContacts';
        logger.debug(functionName, 'Opening contact list modal');

        getContacts(id).then(
            function(contacts) {
                if(contacts.length == 0) {
                    logger.info(functionName, "No contacts found for client: " + id);

                    $(selectors.listContacts + ' tbody').append(elements.emptyContactListRow);
                } else {
                    logger.info(functionName, "Adding contacts to the project list modal");

                    $(contacts).each(function() {
                        $(selectors.listContacts + ' tbody').append(
                            elements.contactListRow
                                .replace('{firstname}', this.firstName)
                                .replace('{lastname}', this.lastName)
                                .replace('{mail}', this.mail)
                                .replace('{phone}', this.phone)
                                .replace('{address}', this.address)
                        );
                    });
                }
            },
            function() {
                logger.error(functionName, 'Opening modal with error message');

                $(selectors.listContacts + ' tbody').append(elements.errorContactListRow);
            });

        $(selectors.listContacts).removeClass('hidden');
    },

    _hideContacts = function() {
        var functionName = moduleName + '.hideContacts';
        logger.debug(functionName, 'Closing contact list modal');

        $(selectors.listContacts).addClass('hidden');

        logger.info(functionName, 'Removing table rows from contact list modal');

        $(selectors.listContacts + ' tbody').html('');
    };

    return {
        showSection : _showSection,
        showAdd : _showAdd,
        hideAdd : _hideAdd,
        showEdit : _showEdit,
        hideEdit : _hideEdit,
        showDelete : _showDelete,
        hideDelete : _hideDelete,
        showProjects : _showProjects,
        hideProjects : _hideProjects,
        showContacts : _showContacts,
        hideContacts : _hideContacts
    };
}());

projectInventory.module.contact = (function () {
    var moduleName = 'projectInventory.module.contact',

    selectors = {
        clientSection : '#clientSection',
        contactSection : '#contactSection',
        contactAdd : '#contactAdd',
        contactClientAdd : '#contactClientAdd',
        contactInfoModal : '#contactInfoModal',
        contactEdit : '#contactEdit',
        contactClientEdit : '#contactClientEdit',
        deleteModal : '#deleteModal'
    },

    elements = {
        defaultOptionElement : '<option value="-1">-</option>',
        optionElement : '<option value="{id}">{name}</option>'
    },

    _showSection = function() {
        var functionName = moduleName + '.showSection';
        logger.debug(functionName, 'Opening contact section');

        $(selectors.clientSection).addClass('hidden');
        $(selectors.contactSection).removeClass('hidden');

        projectInventory.app.updateActiveTab('right', projectInventory.app.getTabNames().right.CONTACT);
    },

    createClientSelection = function() {
        var functionName = moduleName + '.createClientSelection';
        logger.debug(functionName, "Getting client list");

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + "/clients/list")
                .done(function (data) {
                    logger.info(functionName, 'Found clients: ' + JSON.stringify(data));

                    if (data.length == 0) {
                        logger.info(functionName, 'No clients found!');
                        reject();
                    }
                    var result = '';

                    $(data).each(function () {
                        result += elements.optionElement
                            .replace('{id}', this.id)
                            .replace('{name}', this.name);
                    });

                    logger.info(functionName, 'Option elements: ' + result);

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showAdd = function() {
        var functionName = moduleName + '.showAdd';
        logger.debug(functionName, 'Opening add contact modal');

        createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(selectors.contactClientAdd + ' select').append(element);
            },
            function() {
                logger.info(functionName, 'Opening modal with empty client selection');
            });

        $(selectors.contactAdd).removeClass('hidden');
    },

    _hideAdd = function() {
        var functionName = moduleName + '.hideAdd';
        logger.debug(functionName, 'Closing add contact modal');

        $(selectors.contactAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add contact modal');

        $(selectors.contactClientAdd + ' select').html(elements.defaultOptionElement);
        $(selectors.contactAdd + ' input').val('');
    },

    _showInfo = function(id, firstName, lastName, client, mail, phone, address) {
        var functionName = moduleName + '.showInfo';
        logger.debug(functionName, 'Opening contact info modal');

        $(selectors.contactInfoModal + ' .first-name').html(firstName);
        $(selectors.contactInfoModal + ' .last-name').html(lastName);
        $(selectors.contactInfoModal + ' .client').html(client);
        $(selectors.contactInfoModal + ' .mail').html(mail);
        $(selectors.contactInfoModal + ' .phone').html(phone);
        $(selectors.contactInfoModal + ' .address').html(address);

        $(selectors.contactInfoModal + ' form').attr('action', projectInventory.app.appPath + '/contacts/vcard/' + id);

        $(selectors.contactInfoModal).removeClass('hidden');
    },

    _hideInfo = function() {
        var functionName = moduleName + '.hideInfo';
        logger.debug(functionName, 'Closing contact info modal');

        $(selectors.contactInfoModal + ' .first-name').html('');
        $(selectors.contactInfoModal + ' .last-name').html('');
        $(selectors.contactInfoModal + ' .client').html('');
        $(selectors.contactInfoModal + ' .mail').html('');
        $(selectors.contactInfoModal + ' .phone').html('');
        $(selectors.contactInfoModal + ' .address').html('');

        $(selectors.contactInfoModal + ' form').attr('action', '');

        $(selectors.contactInfoModal).addClass('hidden');
    },

    _showEdit = function(id, firstName, lastName, client, mail, phone, address) {
        var functionName = moduleName + '.showEdit';
        logger.debug(functionName, 'Opening edit contact modal');

        $(selectors.contactEdit + ' .id').val(id);
        $(selectors.contactEdit + ' .first-name').val(firstName);
        $(selectors.contactEdit + ' .last-name').val(lastName);
        $(selectors.contactEdit + ' .mail').val(mail);
        $(selectors.contactEdit + ' .phone').val(phone);
        $(selectors.contactEdit + ' .address').val(address);

        createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(selectors.contactClientEdit + ' select').append(element);
                $(selectors.contactClientEdit + ' select').val(client);
            },
            function() {
                logger.info(functionName, 'Opening modal with empty client selection');
            });

        $(selectors.contactEdit).removeClass('hidden');
    },

    _hideEdit = function() {
        var functionName = moduleName + '.hideEdit';
        logger.debug(functionName, 'Closing edit contact modal');

        $(selectors.contactEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for edit contact modal');

        $(selectors.contactClientEdit + ' select').html(elements.defaultOptionElement);
        $(selectors.contactEdit + ' input').val('');
    },

    _showDelete = function(id, firstName, lastName) {
        var functionName = moduleName + '.showDelete';
        logger.debug(functionName, 'Opening delete contact modal');

        logger.info(functionName, 'Contact selected for delete: [ ' + id + ', ' + firstName + ', ' + lastName + ' ]');

        $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/contacts/delete/' + id);
        $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.contact.hideDelete()');
        $(selectors.deleteModal).removeClass('hidden');
    },

    _hideDelete = function() {
        var functionName = moduleName + '.hideDeleteModal';
        logger.debug(functionName, 'Closing delete modal');

        $(selectors.deleteModal).addClass('hidden');
        $(selectors.deleteModal + ' :button').attr('onclick', '');
    };

    return {
        showSection : _showSection,
        showAdd : _showAdd,
        hideAdd : _hideAdd,
        showInfo : _showInfo,
        hideInfo : _hideInfo,
        showEdit : _showEdit,
        hideEdit : _hideEdit,
        showDelete : _showDelete,
        hideDelete : _hideDelete
    };
}());

projectInventory.module.project = (function() {
    var moduleName = 'projectInventory.module.project',

    selectors = {
        projectSection: '#projectSection',
        noteSection: '#noteSection',
        worktimeSection: '#worktimeSection',
        projectAdd: '#projectAdd',
        projectClientAdd: '#projectClientAdd',
        projectStatusAdd : '#projectStatusAdd',
        projectPriorityAdd : '#projectPriorityAdd',
        listNotes: '#listNotes',
        projectEdit: '#projectEdit',
        projectClientEdit: '#projectClientEdit',
        projectStatusEdit : '#projectStatusEdit',
        projectPriorityEdit : '#projectPriorityEdit',
        project : '#project-',
        formElement: '.form-element',
        errorElement: '.error-element',
        deleteModal : '#deleteModal'
    },

    elements = {
        defaultOptionElement : '<option value="-1">-</option>',
        optionElement : '<option value="{id}">{name}</option>',
        emptyNoteListRow : '<tr><td colspan="2">No notes found for this project</td></tr>',
        errorNoteListRow : '<tr><td colspan="2">Cannot retrieve note list for this project</td></tr>',
        noteListRow : '<tr><td>{date}</td><td><ul>{comments}</ul></td></tr>',
        commentListElement : '<li>{comment}</li>'
    },

    _showSection = function() {
        var functionName = moduleName + '.showSection';
        logger.debug(functionName, 'Opening project section');

        $(selectors.projectSection).removeClass('hidden');
        $(selectors.noteSection).addClass('hidden');
        $(selectors.worktimeSection).addClass('hidden');

        projectInventory.app.updateActiveTab('left', projectInventory.app.getTabNames().left.PROJECT);
    },

    createClientSelection = function() {
        var functionName = moduleName + '.createClientSelection';
        logger.debug(functionName, "Getting client list");

        return new Promise(function(resolve, reject) {
            $.ajax({
                url : projectInventory.app.appPath + "/clients/list",
                method : 'GET',
                timeout : 200
            })
                .done(function (data) {
                    logger.info(functionName, 'Found clients: ' + JSON.stringify(data));

                    if (data.length == 0) {
                        logger.info(functionName, 'No clients found!');
                        reject();
                    }

                    var result = '';

                    $(data).each(function () {
                        result += elements.optionElement
                            .replace('{id}', this.id)
                            .replace('{name}', this.name);
                    });

                    logger.info(functionName, 'Option elements: ' + result);

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showAdd = function() {
        var functionName = moduleName + '.showAdd';
        logger.debug(functionName, 'Opening add project modal');

        createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(selectors.projectClientAdd + ' select').append(element);

                projectInventory.module.modal.show(selectors.projectAdd, false);
            },
            function() {
                logger.info(functionName, 'Opening modal with empty client selection');

                projectInventory.module.modal.show(selectors.projectAdd, false);
            });
    },

    _hideAdd = function() {
        var functionName = moduleName + '.hideAdd';
        logger.debug(functionName, 'Closing add project modal');

        projectInventory.module.modal.hide(selectors.projectAdd, false);

        logger.info(functionName, 'Setting default form values for add project modal');

        $(selectors.projectClientAdd + ' select').html(elements.defaultOptionElement);
        $(selectors.projectAdd + ' input').val('');
        $(selectors.projectStatusAdd).val($(selectors.projectStatusAdd + ' option')[0].value);
        $(selectors.projectPriorityAdd).val($(selectors.projectPriorityAdd + ' option')[0].value);
    },

    getNotes = function(id) {
        var functionName = moduleName + '.getNotes';
        logger.debug(functionName, "Getting note list");

        return new Promise(function(resolve, reject) {
            $.ajax({
                url : projectInventory.app.appPath + "/notes/list/" + id,
                method : 'GET',
                timeout : 200
            })
                .done(function (data) {
                    logger.info(functionName, 'Found notes: ' + JSON.stringify(data));

                    if (data.length == 0) {
                        logger.info(functionName, 'No notes found!');
                        reject(elements.emptyNoteListRow);
                    }

                    var result = '';

                    $(data).each(function () {
                        var comments = '';

                        if(this.comments.length > 0) {
                            $(this.comments).each(function() {
                                comments += elements.commentListElement.replace('{comment}', this);
                            });
                        } else
                            comments = '-';

                        result += elements.noteListRow
                            .replace('{date}', this.date)
                            .replace('{comments}', comments);
                    });

                    logger.info(functionName, 'Notes: ' + result);

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject(elements.errorNoteListRow);
                });
        });
    },

    _showNotes = function(id) {
        var functionName = moduleName + '.showNotes';
        logger.debug(functionName, "Opening note list");

        getNotes(id).then(
            function(element) {
                $(selectors.listNotes + ' tbody').html(element);

                projectInventory.module.modal.show(selectors.listNotes, true);
            },
            function(element) {
                $(selectors.listNotes + ' tbody').html(element);

                projectInventory.module.modal.show(selectors.listNotes, false);
            });
    },

    _hideNotes = function() {
        var functionName = moduleName + '.showNotes';
        logger.debug(functionName, "Closing note list");

        projectInventory.module.modal.hide(selectors.listNotes);

        $(selectors.listNotes + ' tbody').html('');
    },

    _showEdit = function(id) {
        var functionName = moduleName + '.showEdit';
        logger.debug(functionName, 'Opening edit project modal');

        var selectedRow = selectors.project + id;

        $(selectors.projectEdit + ' .id').val(id);
        $(selectors.projectEdit + ' .name').val($(selectedRow + ' .name').html());
        $(selectors.projectEdit + ' .code').val($(selectedRow + ' .code').html());
        $(selectors.projectStatusEdit).val($(selectedRow + ' .status').html());
        $(selectors.projectPriorityEdit).val($(selectedRow + ' .priority').html());

        createClientSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with client selection');

                $(selectors.projectClientEdit + ' select').append(element);
                $(selectors.projectClientEdit + ' select').val($(selectedRow + ' .client').attr('data'));

                projectInventory.module.modal.show(selectors.projectEdit, false);
            },
            function() {
                logger.info(functionName, 'Opening modal with empty client selection');

                projectInventory.module.modal.show(selectors.projectEdit, false);
            });
    },

    _hideEdit = function() {
        var functionName = moduleName + '.hideEdit';
        logger.debug(functionName, 'Closing edit project modal');

        projectInventory.module.modal.hide(selectors.projectEdit, false);

        logger.info(functionName, 'Setting default form values for edit project modal');

        $(selectors.projectClientEdit + ' select').html(elements.defaultOptionElement);
        $(selectors.projectEdit + ' input').val('');
        $(selectors.projectStatusEdit).val($(selectors.projectStatusEdit + ' option')[0].value);
        $(selectors.projectPriorityEdit).val($(selectors.projectPriorityEdit + ' option')[0].value);
    },

    _showDelete = function(id, name) {
        var functionName = moduleName + '.showDelete';
        logger.debug(functionName, 'Opening delete project modal');

        logger.info(functionName, 'Project selected for delete: [ ' + id + ', ' + name + ' ]');

        $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/projects/delete/' + id);
        $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.project.hideDelete()');
        projectInventory.module.modal.show(selectors.deleteModal, false);
    },

    _hideDelete = function() {
        var functionName = moduleName + '.hideDeleteModal';
        logger.debug(functionName, 'Closing delete modal');

        projectInventory.module.modal.hide(selectors.deleteModal, false);
        $(selectors.deleteModal + ' :button').attr('onclick', '');
    };

    return {
        showSection : _showSection,
        showAdd : _showAdd,
        hideAdd : _hideAdd,
        showNotes : _showNotes,
        hideNotes : _hideNotes,
        showEdit : _showEdit,
        hideEdit : _hideEdit,
        showDelete : _showDelete,
        hideDelete : _hideDelete
    }
}());

projectInventory.module.note = (function() {
    var moduleName = 'projectInventory.module.note', lastNoteId,

    selectors = {
        projectSection: '#projectSection',
        noteSection: '#noteSection',
        worktimeSection: '#worktimeSection',
        noteAdd: '#noteAdd',
        noteProjectAdd: '#noteProjectAdd',
        note: '#note-',
        commentsModal: '#commentsModal',
        commentsList: '#commentsList',
        noteCommentAdd: '#noteCommentAdd',
        noteComment: '#noteComment',
        comment: '#comment-',
        noteEdit: '#noteEdit',
        noteProjectEdit: '#noteProjectEdit',
        deleteModal : '#deleteModal'
    },

    elements = {
        defaultOptionElement : '<option value="-1">-</option>',
        optionElement : '<option value="{id}">{name}</option>',
        commentElement : '' +
            '<div id="comment-{id}" class="row">' +
                '<div class="eleven columns">{comment}</div>' +
                '<div class="one column">' +
                    '<i class="fas fa-times cursor-pointer" onclick="projectInventory.module.note.deleteComment(\'{id}\', \'{comment}\')"></i>' +
                '</div>' +
            '</div>'
    },

    _showSection = function() {
        var functionName = moduleName + '.showSection';
        logger.debug(functionName, 'Opening project section');

        $(selectors.projectSection).addClass('hidden');
        $(selectors.noteSection).removeClass('hidden');
        $(selectors.worktimeSection).addClass('hidden');

        projectInventory.app.updateActiveTab('left', projectInventory.app.getTabNames().left.NOTE);
    },

    getDate = function() {
        var functionName = moduleName + '.getDate';
        logger.debug(functionName, "Getting date from server");

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + "/home/now/date")
                .done(function(data) {
                    logger.info(functionName, "Date: " + data);

                    resolve(data);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    createProjectSelection = function() {
        var functionName = moduleName + '.createProjectSelection';
        logger.debug(functionName, "Getting project list");

        return new Promise(function(resolve, reject) {
            $.get(projectInventory.app.appPath + "/projects/list")
                .done(function (data) {
                    logger.info(functionName, 'Found projects: ' + JSON.stringify(data));

                    if (data.length == 0) {
                        logger.info(functionName, 'No projects found!');
                        reject();
                    }

                    var result = '';

                    $(data).each(function () {
                        result += elements.optionElement
                            .replace('{id}', this.id)
                            .replace('{name}', this.name);
                    });

                    logger.info(functionName, 'Option elements: ' + result);

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showAdd = function() {
        var functionName = moduleName + '.showAdd';
        logger.debug(functionName, 'Opening add project modal');

        getDate().then(
            function(date) {
                logger.info(functionName, 'Opening modal with date info');

                $(selectors.noteAdd + ' .date').val(date);
            },
            function() {
                logger.info(functionName, 'Opening modal without date info');
            });

        createProjectSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with project selection');

                $(selectors.noteProjectAdd + ' select').append(element);
            },
            function() {
                logger.info(functionName, 'Opening modal with empty project selection');
            });

        $(selectors.noteAdd).removeClass('hidden');
    },

    _hideAdd = function() {
        var functionName = moduleName + '.hideAdd';
        logger.debug(functionName, 'Closing add note modal');

        $(selectors.noteAdd).addClass('hidden');

        logger.info(functionName, 'Setting default form values for add note modal');

        $(selectors.noteProjectAdd + ' select').html(elements.defaultOptionElement);
        $(selectors.noteAdd + ' input').val('');
    },

    getComments = function(id) {
        var functionName = moduleName + '.getComments';
        logger.debug(functionName, "Getting comments from server");

        return new Promise(function(resolve, reject) {
            $.ajax({
                url : projectInventory.app.appPath + "/notes/comment/get/" + id,
                method : 'GET',
                timeout : 200
            })
                .done(function(data) {
                    logger.info(functionName, "Comments: " + data);

                    if(data.length == 0) {
                        logger.info(functionName, 'No comments found!');
                        reject();
                    }

                    var result = '';

                    for(var i = 0; i < data.length; i++) {
                        result += elements.commentElement
                            .replace(/{id}/g, i)
                            .replace(/{comment}/g, data[i]);
                    }

                    resolve(result);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                    reject();
                });
        });
    },

    _showComments = function(id) {
        var functionName = moduleName + '.showComments';
        logger.debug(functionName, 'Opening comments modal');

        lastNoteId = id;

        getComments(id).then(
            function(elements) {
                logger.info(functionName, 'Opening modal with comments');

                $(selectors.commentsList).append(elements);

                projectInventory.module.modal.show(selectors.commentsModal, true);
            },
            function() {
                logger.info(functionName, 'Opening modal without comments');

                projectInventory.module.modal.show(selectors.commentsModal, true);
            });
    },

    _showAddComment = function() {
        var functionName = moduleName + '.showAddComment';
        logger.debug(functionName, 'Showing add comment section');

        $(selectors.noteCommentAdd).removeClass('hidden');

        if(!$(selectors.commentsModal + ' .modal-window').hasClass('scroll')) {
            var height = $(window).height() * 0.7 - 30;

            if (height < $(selectors.commentsModal + ' .modal-window').height()) {
                $(selectors.commentsModal + ' .modal-window').addClass('scroll');
                $(selectors.commentsModal + ' .modal-content').addClass('scroll');
                $(selectors.commentsModal + ' .modal-button').addClass('scroll');

                $(selectors.commentsModal + ' .modal-content').addClass('small');
            }
        }
    },

    _addComment = function() {
        var functionName = moduleName + '.addComment';
        logger.debug(functionName, 'Adding comment');

        var comment = $(selectors.noteComment).val();

        $.post({
            url : projectInventory.app.appPath + '/notes/comment/add',
            contentType : "application/json",
            data : JSON.stringify({
                noteId : lastNoteId,
                comment : comment
            })
        })
            .done(function() {
                logger.info(functionName, 'Comment added successfully');

                $(selectors.commentsList).append(
                    elements.commentElement
                        .replace(/{id}/g, $(selectors.commentsList + ' .row').length)
                        .replace(/{comment}/g, comment));

                $(selectors.noteComment).val('');

                if(!$(selectors.commentsModal + ' .modal-window').hasClass('scroll')) {
                    var height = $(window).height() * 0.7 - 30;

                    if (height < $(selectors.commentsModal + ' .modal-window').height()) {
                        $(selectors.commentsModal + ' .modal-window').addClass('scroll');
                        $(selectors.commentsModal + ' .modal-content').addClass('scroll');
                        $(selectors.commentsModal + ' .modal-button').addClass('scroll');

                        $(selectors.commentsModal + ' .modal-content').addClass('small');
                    }
                }
            })
            .fail(function() {
                logger.error(functionName, 'Cannot reach the server');
            });
    },

    _deleteComment = function(id, comment) {
        var functionName = moduleName + '.deleteComment';
        logger.debug(functionName, 'Deleting comment');

        $.post({
            url : projectInventory.app.appPath + '/notes/comment/delete',
            contentType : "application/json",
            data : JSON.stringify({
                noteId : lastNoteId,
                comment : comment
            })
        })
            .done(function() {
                logger.info(functionName, 'Comment deleted successfully');

                $(selectors.comment + id).remove();

                if($(selectors.commentsModal + ' .modal-window').hasClass('scroll')) {
                    var height = $(window).height() * 0.7 - 30;

                    if (height >= $(selectors.commentsModal + ' .modal-window').height()) {
                        $(selectors.commentsModal + ' .modal-window').removeClass('scroll');
                        $(selectors.commentsModal + ' .modal-content').removeClass('scroll');
                        $(selectors.commentsModal + ' .modal-button').removeClass('scroll');

                        $(selectors.commentsModal + ' .modal-content').removeClass('small');
                    }
                }
            })
            .fail(function() {
                logger.error(functionName, 'Cannot reach the server');
            });
    },

    _hideAddComment = function() {
        var functionName = moduleName + '.hideAddComment';
        logger.debug(functionName, 'Hiding add comment section');

        $(selectors.noteCommentAdd).addClass('hidden');

        if($(selectors.commentsModal + ' .modal-window').hasClass('scroll')) {
            var height = $(window).height() * 0.7 - 30;

            if (height >= $(selectors.commentsModal + ' .modal-window').height()) {
                $(selectors.commentsModal + ' .modal-window').removeClass('scroll');
                $(selectors.commentsModal + ' .modal-content').removeClass('scroll');
                $(selectors.commentsModal + ' .modal-button').removeClass('scroll');

                $(selectors.commentsModal + ' .modal-content').removeClass('small');
            }
        }

        logger.info(functionName, 'Setting default values for add comment section');

        $(selectors.commentsModal + ' input').val('');
    },

    _hideComments = function() {
        var functionName = moduleName + '.hideComments';
        logger.debug(functionName, 'Closing comments modal');

        lastNoteId = -1;

        projectInventory.module.modal.hide(selectors.commentsModal, true);
        $(selectors.commentsModal + ' .modal-content').removeClass('small');

        $(selectors.noteCommentAdd).addClass('hidden');

        logger.info(functionName, 'Setting default values for comments modal');

        $(selectors.commentsList).html('');
        $(selectors.commentsModal + ' input').val('');
    },

    _showEdit = function(id) {
        var functionName = moduleName + '.showEdit';
        logger.debug(functionName, 'Opening edit note modal');

        var selectedRow = selectors.note + id;

        $(selectors.noteEdit + ' .id').val(id);
        $(selectors.noteEdit + ' .date').val($(selectedRow + ' .date').html());

        createProjectSelection().then(
            function(element) {
                logger.info(functionName, 'Opening modal with project selection');

                $(selectors.noteProjectEdit + ' select').append(element);
                $(selectors.noteProjectEdit + ' select').val($(selectedRow + ' .project').attr('data'));
            },
            function() {
                logger.info(functionName, 'Opening modal with empty project selection');
            });

        $(selectors.noteEdit).removeClass('hidden');
    },

    _hideEdit = function() {
        var functionName = moduleName + '.hideEdit';
        logger.debug(functionName, 'Closing edit note modal');

        $(selectors.noteEdit).addClass('hidden');

        logger.info(functionName, 'Setting default form values for edit note modal');

        $(selectors.noteProjectEdit + ' select').html(elements.defaultOptionElement);
        $(selectors.noteEdit + ' input').val('');
    },

    _showDelete = function(id) {
        var functionName = moduleName + '.showDelete';
        logger.debug(functionName, 'Opening delete note modal');

        logger.info(functionName, 'Project selected for delete: [ ' + id + ', ' + name + ' ]');

        $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/notes/delete/' + id);
        $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.note.hideDelete()');
        $(selectors.deleteModal).removeClass('hidden');
    },

    _hideDelete = function() {
        var functionName = moduleName + '.hideDeleteModal';
        logger.debug(functionName, 'Closing delete modal');

        $(selectors.deleteModal).addClass('hidden');
        $(selectors.deleteModal + ' :button').attr('onclick', '');
    };

    return {
        showSection : _showSection,
        showAdd : _showAdd,
        hideAdd : _hideAdd,
        showComments : _showComments,
        showAddComment : _showAddComment,
        addComment : _addComment,
        deleteComment : _deleteComment,
        hideAddComment : _hideAddComment,
        hideComments : _hideComments,
        showEdit : _showEdit,
        hideEdit : _hideEdit,
        showDelete : _showDelete,
        hideDelete : _hideDelete
    }
}());

projectInventory.module.worktime = (function() {
    var moduleName = 'projectInventory.module.worktime',

    selectors = {
        projectSection: '#projectSection',
        noteSection: '#noteSection',
        worktimeSection: '#worktimeSection'
    },

    _showSection = function() {
        var functionName = moduleName + '.showSection';
        logger.debug(functionName, 'Opening project section');

        $(selectors.projectSection).addClass('hidden');
        $(selectors.noteSection).addClass('hidden');
        $(selectors.worktimeSection).removeClass('hidden');

        projectInventory.app.updateActiveTab('left', projectInventory.app.getTabNames().left.WORKTIME);
    };

    return {
        showSection : _showSection
    }
}());

$(function() {
    projectInventory.app.init();
});