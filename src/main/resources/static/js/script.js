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

        deafultLevelStringLength = 6, defaultFunctionNameLength = 34,

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

            if(myLevel.length < deafultLevelStringLength)
                levelString = ' '.repeat(deafultLevelStringLength - myLevel.length) + myLevel;
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

            if(functionName.length > defaultFunctionNameLength) {
                var functionNameSlices = functionName.split('.');
                functionName = '';

                for(var i = 0; i < functionNameSlices.length - 1; i++) {
                    functionName += functionNameSlices[i].charAt(0) + '.';
                }

                functionName += functionNameSlices[functionNameSlices.length - 1];
            }

            if(functionName.length < defaultFunctionNameLength)
                functionName = functionName + ' '.repeat(defaultFunctionNameLength - functionName.length);

            console.log('%c%s - %c[%s] %s %c: %s',
                timeColor, date(),
                levelColor, levelString, functionName,
                messageColor, message);
        };

    return {
        debug           : function(functionName, message) {
            log(DEBUG, functionName, message);
        },

        info            : function(functionName, message) {
            log(INFO, functionName, message);
        },

        error           : function(functionName, message) {
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

        _timeout = 200,

        tabNames = {
            left : {
                PROJECT : 'PROJECT',
                NOTE : 'NOTE',
                WORKTIME : 'WORKTIME'
            },
            right : {
                CLIENT : 'CLIENT',
                CONTACT : 'CONTACT',
                PROFILE : 'PROFILE'
            }
        },

        sectionSelectors = {
            PROJECT : '#projectSection',
            NOTE : '#noteSection',
            WORKTIME : '#worktimeSection',
            CLIENT : '#clientSection',
            CONTACT : '#contactSection',
            PROFILE : '#profileSection'
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
        appPath         : _appPath,
        timeout         : _timeout,
        getTabNames     : function() { return tabNames },
        updateActiveTab : _updateActiveTab,
        init            : _init
    };
}());

projectInventory.module = {};

projectInventory.module.modal = (function() {
    var moduleName = 'projectInventory.module.modal',

        _checkScrolling = function(modalName, setSmallParameter, forceDisableScrolling) {
            var functionName = moduleName + '.checkScrolling';
            logger.debug(functionName, 'Checking modal height');

            var height = $(window).height() * 0.7 - 30;
            var modalHeight = $(modalName + ' .modal-window').height();

            if($(modalName + ' .modal-window').hasClass('scroll'))
                modalHeight += $(modalName + ' .modal-content')[0].scrollHeight - $(modalName + ' .modal-content').height();

            if(height < modalHeight && !forceDisableScrolling) {
                $(modalName + ' .modal-window').addClass('scroll');
                $(modalName + ' .modal-content').addClass('scroll');
                $(modalName + ' .modal-button').addClass('scroll');

                if(setSmallParameter)
                    $(modalName + ' .modal-content').addClass('small');
                else
                    $(modalName + ' .modal-content').removeClass('small');
            } else {
                $(modalName + ' .modal-window').removeClass('scroll');
                $(modalName + ' .modal-content').removeClass('scroll');
                $(modalName + ' .modal-button').removeClass('scroll');

                $(modalName + ' .modal-content').removeClass('small');
            }
        },

        _show = function(modalName, enableScrolling, setSmallParameter, forceDisableScrolling) {
            $(modalName).removeClass('hidden');

            if(enableScrolling)
                _checkScrolling(modalName, setSmallParameter, forceDisableScrolling);
        },

        _hide = function(modalName) {
            $(modalName).addClass('hidden');

            _checkScrolling(modalName, true, true);
        };

    return {
        show            : _show,
        hide            : _hide,
        checkScrolling  : _checkScrolling
    };
}());

projectInventory.module.client = (function() {
    var moduleName = 'projectInventory.module.client',

        selectors = {
            clientSection : '#clientSection',
            contactSection : '#contactSection',
            profileSection : '#profileSection',
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
            $(selectors.profileSection).addClass('hidden');

            projectInventory.app.updateActiveTab('right', projectInventory.app.getTabNames().right.CLIENT);
        },

        _showAdd = function() {
            var functionName = moduleName + '.showAdd';
            logger.debug(functionName, 'Opening add client modal');

            projectInventory.module.modal.show(selectors.clientAdd, false, false, false);
        },

        _hideAdd = function() {
            var functionName = moduleName + '.hideAdd';
            logger.debug(functionName, 'Closing add client modal');

            projectInventory.module.modal.hide(selectors.clientAdd);

            logger.info(functionName, 'Setting default form values for add client modal');

            $(selectors.clientAdd + ' input').val('');
        },

        _showEdit = function(id) {
            var functionName = moduleName + '.showEdit';
            logger.debug(functionName, 'Opening edit client modal');
            logger.info(functionName, "Setting form values for edit client modal");

            $(selectors.clientEdit + ' .id').val(id);
            $(selectors.clientEdit + ' .name').val($(selectors.client + id + ' .name').html());
            $(selectors.clientEdit + ' .alias').val($(selectors.client + id + ' .alias').html());

            projectInventory.module.modal.show(selectors.clientEdit, false, false, false);
        },

        _hideEdit = function() {
            var functionName = moduleName + '.hideEdit';
            logger.debug(functionName, 'Closing edit client modal');

            projectInventory.module.modal.hide(selectors.clientEdit);

            logger.info(functionName, 'Setting default form values for edit client modal');

            $(selectors.clientEdit + ' input').val('');
        },

        _showDelete = function(id, name) {
            var functionName = moduleName + '.showDelete';
            logger.debug(functionName, 'Opening delete client modal');

            logger.info(functionName, 'Client selected for delete: [ ' + id + ', ' + name + ' ]');

            $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/clients/delete/' + id);
            $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.client.hideDelete()');

            projectInventory.module.modal.show(selectors.deleteModal, false, false, false);
        },

        _hideDelete = function() {
            var functionName = moduleName + '.hideDelete';
            logger.debug(functionName, 'Closing delete client modal');

            projectInventory.module.modal.hide(selectors.deleteModal);

            $(selectors.deleteModal + ' :button').attr('onclick', '');
        },

        getProjects = function(id) {
            var functionName = moduleName + '.getProjects';
            logger.debug(functionName, 'Getting project list for client');

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + '/projects/list/' + id,
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
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

                    projectInventory.module.modal.show(selectors.listProjects, true, false, false);
                },
                function() {
                    logger.error(functionName, 'Opening modal with error message');

                    $(selectors.listProjects + ' tbody').append(elements.errorProjectListRow);

                    projectInventory.module.modal.show(selectors.listProjects, true, false, false);
                });
        },

        _hideProjects = function() {
            var functionName = moduleName + '.hideProjects';
            logger.debug(functionName, 'Closing project list modal');

            projectInventory.module.modal.hide(selectors.listProjects);

            logger.info(functionName, 'Removing table rows from project list modal');

            $(selectors.listProjects + ' tbody').html('');
        },

        getContacts = function(id) {
            var functionName = moduleName + '.getContacts';
            logger.debug(functionName, 'Getting contact list for client');

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + '/contacts/list/' + id,
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
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

                    projectInventory.module.modal.show(selectors.listContacts, true, false, false);
                },
                function() {
                    logger.error(functionName, 'Opening modal with error message');

                    $(selectors.listContacts + ' tbody').append(elements.errorContactListRow);

                    projectInventory.module.modal.show(selectors.listContacts, true, false, false);
                });
        },

        _hideContacts = function() {
            var functionName = moduleName + '.hideContacts';
            logger.debug(functionName, 'Closing contact list modal');

            projectInventory.module.modal.hide(selectors.listContacts);

            logger.info(functionName, 'Removing table rows from contact list modal');

            $(selectors.listContacts + ' tbody').html('');
        };

    return {
        showSection     : _showSection,
        showAdd         : _showAdd,
        hideAdd         : _hideAdd,
        showEdit        : _showEdit,
        hideEdit        : _hideEdit,
        showDelete      : _showDelete,
        hideDelete      : _hideDelete,
        showProjects    : _showProjects,
        hideProjects    : _hideProjects,
        showContacts    : _showContacts,
        hideContacts    : _hideContacts
    };
}());

projectInventory.module.contact = (function () {
    var moduleName = 'projectInventory.module.contact',

        selectors = {
            clientSection : '#clientSection',
            contactSection : '#contactSection',
            profileSection : '#profileSection',
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
            $(selectors.profileSection).addClass('hidden');

            projectInventory.app.updateActiveTab('right', projectInventory.app.getTabNames().right.CONTACT);
        },

        createClientSelection = function() {
            var functionName = moduleName + '.createClientSelection';
            logger.debug(functionName, "Getting client list");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + "/clients/list",
                    method : 'GET',
                    timeout : projectInventory.app.timeout
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
            logger.debug(functionName, 'Opening add contact modal');

            createClientSelection().then(
                function(element) {
                    logger.info(functionName, 'Opening modal with client selection');

                    $(selectors.contactClientAdd + ' select').append(element);

                    projectInventory.module.modal.show(selectors.contactAdd, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty client selection');

                    projectInventory.module.modal.show(selectors.contactAdd, false, false, false);
                });
        },

        _hideAdd = function() {
            var functionName = moduleName + '.hideAdd';
            logger.debug(functionName, 'Closing add contact modal');

            projectInventory.module.modal.hide(selectors.contactAdd);

            logger.info(functionName, 'Setting default form values for add contact modal');

            $(selectors.contactClientAdd + ' select').html(elements.defaultOptionElement);
            $(selectors.contactAdd + ' input').val('');
        },

        getContactInfo = function(id) {
            var functionName = moduleName + '.getContactInfo';
            logger.debug(functionName, 'Getting contact info');

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url : projectInventory.app.appPath + "/contacts/info/" + id,
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
                    .done(function(data) {
                        logger.info(functionName, 'Found contact: ' + JSON.stringify(data));

                        resolve(data);
                    })
                    .fail(function() {
                        logger.error(functionName, 'Cannot reach the server');
                        reject();
                    });
            });
        },

        _showInfo = function(id) {
            var functionName = moduleName + '.showInfo';
            logger.debug(functionName, 'Opening contact info modal');

            getContactInfo(id).then(
                function(contact) {
                    logger.info(functionName, 'Opening modal with contact info');
                    console.log(contact);

                    $(selectors.contactInfoModal + ' .first-name').html(contact.firstName);
                    $(selectors.contactInfoModal + ' .last-name').html(contact.lastName);
                    $(selectors.contactInfoModal + ' .client').html(contact.client.name);
                    $(selectors.contactInfoModal + ' .mail').html(contact.mail);
                    $(selectors.contactInfoModal + ' .phone').html(contact.phone);
                    $(selectors.contactInfoModal + ' .address').html(contact.address);

                    $(selectors.contactInfoModal + ' form').attr('action', projectInventory.app.appPath + '/contacts/vcard/' + id);

                    projectInventory.module.modal.show(selectors.contactInfoModal, false, false, false);
                },
                function() {
                    logger.error(functionName, 'Nothing to show');
                });
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

            projectInventory.module.modal.hide(selectors.contactInfoModal);
        },

        _showEdit = function(id) {
            var functionName = moduleName + '.showEdit';
            logger.debug(functionName, 'Opening edit contact modal');

            var client = -1;

            getContactInfo(id).then(
                function(contact) {
                    logger.info(functionName, 'Opening modal with contact info');

                    $(selectors.contactEdit + ' .id').val(id);
                    $(selectors.contactEdit + ' .first-name').val(contact.firstName);
                    $(selectors.contactEdit + ' .last-name').val(contact.lastName);
                    $(selectors.contactEdit + ' .mail').val(contact.mail);
                    $(selectors.contactEdit + ' .phone').val(contact.phone);
                    $(selectors.contactEdit + ' .address').val(contact.address);

                    client = contact.client.id;
                },
                function() {
                    logger.error(functionName, 'Opening modal without contact info');

                    $(selectors.contactEdit + ' .id').val(id);
                    $(selectors.contactEdit + ' .first-name').val('');
                    $(selectors.contactEdit + ' .last-name').val('');
                    $(selectors.contactEdit + ' .mail').val('');
                    $(selectors.contactEdit + ' .phone').val('');
                    $(selectors.contactEdit + ' .address').val('');
                });

            setTimeout(function () {
                createClientSelection().then(
                    function(element) {
                        logger.info(functionName, 'Opening modal with client selection');

                        $(selectors.contactClientEdit + ' select').append(element);
                        $(selectors.contactClientEdit + ' select').val(client);

                        projectInventory.module.modal.show(selectors.contactEdit, false, false, false);
                    },
                    function() {
                        logger.info(functionName, 'Opening modal with empty client selection');

                        projectInventory.module.modal.show(selectors.contactEdit, false, false, false);
                    });
            }, projectInventory.app.timeout);
        },

        _hideEdit = function() {
            var functionName = moduleName + '.hideEdit';
            logger.debug(functionName, 'Closing edit contact modal');

            projectInventory.module.modal.hide(selectors.contactEdit);

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

            projectInventory.module.modal.show(selectors.deleteModal, false, false, false);
        },

        _hideDelete = function() {
            var functionName = moduleName + '.hideDeleteModal';
            logger.debug(functionName, 'Closing delete contact modal');

            projectInventory.module.modal.hide(selectors.deleteModal);

            $(selectors.deleteModal + ' :button').attr('onclick', '');
        };

    return {
        showSection : _showSection,
        showAdd     : _showAdd,
        hideAdd     : _hideAdd,
        showInfo    : _showInfo,
        hideInfo    : _hideInfo,
        showEdit    : _showEdit,
        hideEdit    : _hideEdit,
        showDelete  : _showDelete,
        hideDelete  : _hideDelete
    };
}());

projectInventory.module.profile = (function() {
    var moduleName = 'projectInventory.module.profile',

        selectors = {
            clientSection : '#clientSection',
            contactSection : '#contactSection',
            profileSection : '#profileSection',
            profileContactAdd : '#profileContactAdd',
            profileAdd : '#profileAdd',
            profile : '#profile-',
            profileContactEdit : '#profileContactEdit',
            profileEdit : '#profileEdit',
            deleteModal : '#deleteModal'
        },

        elements = {
            defaultOptionElement : '<option value="-1">-</option>',
            optionElement : '<option value="{id}">{name}</option>'
        },

        _showSection = function() {
            var functionName = moduleName + '.showSection';
            logger.debug(functionName, 'Opening profile section');

            $(selectors.clientSection).addClass('hidden');
            $(selectors.contactSection).addClass('hidden');
            $(selectors.profileSection).removeClass('hidden');

            projectInventory.app.updateActiveTab('right', projectInventory.app.getTabNames().right.PROFILE);
        },

        createContactSelection = function() {
            var functionName = moduleName + '.createContactSelection';
            logger.debug(functionName, "Getting contact list");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + "/contacts/list",
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
                    .done(function (data) {
                        logger.info(functionName, 'Found contacts: ' + JSON.stringify(data));

                        if (data.length == 0) {
                            logger.info(functionName, 'No contacts found!');
                            reject();
                        }
                        var result = '';

                        $(data).each(function () {
                            result += elements.optionElement
                                .replace('{id}', this.id)
                                .replace('{name}', this.firstName + ' ' + this.lastName + ' ( ' + this.client.name + ' )');
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
            logger.debug(functionName, 'Opening add profile modal');

            createContactSelection().then(
                function(element) {
                    logger.info(functionName, 'Opening modal with contact selection');

                    $(selectors.profileContactAdd + ' select').append(element);

                    projectInventory.module.modal.show(selectors.profileAdd, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty contact selection');

                    projectInventory.module.modal.show(selectors.profileAdd, false, false, false);
                });
        },

        _hideAdd = function() {
            var functionName = moduleName + '.hideAdd';
            logger.debug(functionName, 'Closing add profile modal');

            projectInventory.module.modal.hide(selectors.profileAdd);

            logger.info(functionName, 'Setting default form values for add profile modal');

            $(selectors.profileContactAdd + ' select').html(elements.defaultOptionElement);
            $(selectors.profileAdd + ' input').val('');
            $(selectors.profileAdd + ' .overwriteProjectInfo').prop('checked', false);
        },

        _showEdit = function(id) {
            var functionName = moduleName + '.showEdit';
            logger.debug(functionName, 'Opening edit profile modal');

            var selectedRow = selectors.profile + id;

            $(selectors.profileEdit + ' .id').val(id);
            $(selectors.profileEdit + ' .name').val($(selectedRow + ' .name').html());

            var projectInfo = $(selectedRow + ' .project-info').html();
            if(projectInfo.indexOf('Use default') == -1) {
                $(selectors.profileEdit + ' .overwriteProjectInfo').prop('checked', true);
                $(selectors.profileEdit + ' .projectName').val(projectInfo.split(' -- ')[0]);
                $(selectors.profileEdit + ' .projectCode').val(projectInfo.split(' -- ')[1]);
            }

            createContactSelection().then(
                function(element) {
                    logger.info(functionName, 'Opening modal with contact selection');

                    $(selectors.profileContactEdit + ' select').append(element);
                    $(selectors.profileContactEdit + ' select').val($(selectedRow + ' .contact').attr('data'));

                    projectInventory.module.modal.show(selectors.profileEdit, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty contact selection');

                    projectInventory.module.modal.show(selectors.profileEdit, false, false, false);
                });
        },

        _hideEdit = function() {
            var functionName = moduleName + '.hideEdit';
            logger.debug(functionName, 'Closing edit profile modal');

            projectInventory.module.modal.hide(selectors.profileEdit);

            logger.info(functionName, 'Setting default form values for add profile modal');

            $(selectors.profileContactEdit + ' select').html(elements.defaultOptionElement);
            $(selectors.profileEdit + ' input').val('');
            $(selectors.profileEdit + ' .overwriteProjectInfo').prop('checked', false);
        },

        _showDelete = function(id, name) {
            var functionName = moduleName + '.showDelete';
            logger.debug(functionName, 'Opening delete profile modal');

            logger.info(functionName, 'Profile selected for delete: [ ' + id + ', ' + name + ' ]');

            $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/profiles/delete/' + id);
            $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.profile.hideDelete()');

            projectInventory.module.modal.show(selectors.deleteModal, false, false, false);
        },

        _hideDelete = function() {
            var functionName = moduleName + '.hideDeleteModal';
            logger.debug(functionName, 'Closing delete profile modal');

            projectInventory.module.modal.hide(selectors.deleteModal);

            $(selectors.deleteModal + ' :button').attr('onclick', '');
        };

    return {
        showSection : _showSection,
        showAdd     : _showAdd,
        hideAdd     : _hideAdd,
        showEdit    : _showEdit,
        hideEdit    : _hideEdit,
        showDelete  : _showDelete,
        hideDelete  : _hideDelete
    }
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
            listWorktimes: '#listWorktimes',
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
            emptyWorktimeListRow : '<tr><td colspan="5">No worktimes found for this project</td></tr>',
            errorWorktimeListRow : '<tr><td colspan="5">Cannot retrieve worktime list for this project</td></tr>',
            worktimeListRow : '<tr><td>{start}</td><td>{end}</td><td>{description}</td><td><i class="fas fa-{exported}"></i></td></tr>',
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
                    timeout : projectInventory.app.timeout
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

                    projectInventory.module.modal.show(selectors.projectAdd, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty client selection');

                    projectInventory.module.modal.show(selectors.projectAdd, false, false, false);
                });
        },

        _hideAdd = function() {
            var functionName = moduleName + '.hideAdd';
            logger.debug(functionName, 'Closing add project modal');

            projectInventory.module.modal.hide(selectors.projectAdd);

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
                    timeout : projectInventory.app.timeout
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

                    projectInventory.module.modal.show(selectors.listNotes, true, false, false);
                },
                function(element) {
                    $(selectors.listNotes + ' tbody').html(element);

                    projectInventory.module.modal.show(selectors.listNotes, true, false, false);
                });
        },

        _hideNotes = function() {
            var functionName = moduleName + '.showNotes';
            logger.debug(functionName, "Closing note list");

            projectInventory.module.modal.hide(selectors.listNotes);

            $(selectors.listNotes + ' tbody').html('');
        },

        getWorktimes = function(id) {
            var functionName = moduleName + '.getWorktimes';
            logger.debug(functionName, "Getting worktime list");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url : projectInventory.app.appPath + "/worktimes/list/" + id,
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
                    .done(function (data) {
                        logger.info(functionName, 'Found worktimes: ' + JSON.stringify(data));

                        if (data.length == 0) {
                            logger.info(functionName, 'No worktimes found!');
                            reject(elements.emptyWorktimeListRow);
                        }

                        var result = '';

                        $(data).each(function () {
                            result += elements.worktimeListRow
                                .replace('{start}', this.start)
                                .replace('{end}', this.end)
                                .replace('{description}', this.description)
                                .replace('{exported}', this.exported ? 'check' : 'times');
                        });

                        logger.info(functionName, 'Worktimes: ' + result);

                        resolve(result);
                    })
                    .fail(function() {
                        logger.error(functionName, 'Cannot reach the server');
                        reject(elements.errorWorktimeListRow);
                    });
            });
        },

        _showWorktimes = function(id) {
            var functionName = moduleName + '.showWorktimes';
            logger.debug(functionName, "Opening worktime list");

            getWorktimes(id).then(
                function(element) {
                    $(selectors.listWorktimes + ' tbody').html(element);

                    projectInventory.module.modal.show(selectors.listWorktimes, true, false, false);
                },
                function(element) {
                    $(selectors.listWorktimes + ' tbody').html(element);

                    projectInventory.module.modal.show(selectors.listWorktimes, true, false, false);
                });
        },

        _hideWorktimes = function() {
            var functionName = moduleName + '.showWorktimes';
            logger.debug(functionName, "Closing worktime list");

            projectInventory.module.modal.hide(selectors.listWorktimes);

            $(selectors.listWorktimes + ' tbody').html('');
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

                    projectInventory.module.modal.show(selectors.projectEdit, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty client selection');

                    projectInventory.module.modal.show(selectors.projectEdit, false, false, false);
                });
        },

        _hideEdit = function() {
            var functionName = moduleName + '.hideEdit';
            logger.debug(functionName, 'Closing edit project modal');

            projectInventory.module.modal.hide(selectors.projectEdit);

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

            projectInventory.module.modal.show(selectors.deleteModal, false, false, false);
        },

        _hideDelete = function() {
            var functionName = moduleName + '.hideDeleteModal';
            logger.debug(functionName, 'Closing delete project modal');

            projectInventory.module.modal.hide(selectors.deleteModal);

            $(selectors.deleteModal + ' :button').attr('onclick', '');
        };

    return {
        showSection     : _showSection,
        showAdd         : _showAdd,
        hideAdd         : _hideAdd,
        showNotes       : _showNotes,
        hideNotes       : _hideNotes,
        showWorktimes   : _showWorktimes,
        hideWorktimes   : _hideWorktimes,
        showEdit        : _showEdit,
        hideEdit        : _hideEdit,
        showDelete      : _showDelete,
        hideDelete      : _hideDelete
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
            logger.debug(functionName, 'Opening note section');

            $(selectors.projectSection).addClass('hidden');
            $(selectors.noteSection).removeClass('hidden');
            $(selectors.worktimeSection).addClass('hidden');

            projectInventory.app.updateActiveTab('left', projectInventory.app.getTabNames().left.NOTE);
        },

        getDate = function() {
            var functionName = moduleName + '.getDate';
            logger.debug(functionName, "Getting date from server");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + "/home/now/date",
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
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
                $.ajax({
                    url: projectInventory.app.appPath + "/projects/list",
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
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
            logger.debug(functionName, 'Opening add note modal');

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

                    projectInventory.module.modal.show(selectors.noteAdd, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty project selection');

                    projectInventory.module.modal.show(selectors.noteAdd, false, false, false);
                });
        },

        _hideAdd = function() {
            var functionName = moduleName + '.hideAdd';
            logger.debug(functionName, 'Closing add note modal');

            projectInventory.module.modal.hide(selectors.noteAdd);

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
                    timeout : projectInventory.app.timeout
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

                    projectInventory.module.modal.show(selectors.commentsModal, true, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal without comments');

                    projectInventory.module.modal.show(selectors.commentsModal, true, false, false);
                });
        },

        _showAddComment = function() {
            var functionName = moduleName + '.showAddComment';
            logger.debug(functionName, 'Showing add comment section');

            $(selectors.noteCommentAdd).removeClass('hidden');

            projectInventory.module.modal.checkScrolling(selectors.commentsModal, true, false);
        },

        _addComment = function() {
            var functionName = moduleName + '.addComment';
            logger.debug(functionName, 'Adding comment');

            var comment = $(selectors.noteComment).val();

            $.ajax({
                url : projectInventory.app.appPath + '/notes/comment/add',
                method : 'POST',
                timeout : projectInventory.app.timeout,
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

                    projectInventory.module.modal.checkScrolling(selectors.commentsModal, true, false);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                });
        },

        _deleteComment = function(id, comment) {
            var functionName = moduleName + '.deleteComment';
            logger.debug(functionName, 'Deleting comment');

            $.ajax({
                url : projectInventory.app.appPath + '/notes/comment/delete',
                method : 'POST',
                timeout : projectInventory.app.timeout,
                contentType : "application/json",
                data : JSON.stringify({
                    noteId : lastNoteId,
                    comment : comment
                })
            })
                .done(function() {
                    logger.info(functionName, 'Comment deleted successfully');

                    $(selectors.comment + id).remove();

                    projectInventory.module.modal.checkScrolling(selectors.commentsModal, true, false);
                })
                .fail(function() {
                    logger.error(functionName, 'Cannot reach the server');
                });
        },

        _hideAddComment = function() {
            var functionName = moduleName + '.hideAddComment';
            logger.debug(functionName, 'Hiding add comment section');

            $(selectors.noteCommentAdd).addClass('hidden');

            projectInventory.module.modal.checkScrolling(selectors.commentsModal, true, false);

            logger.info(functionName, 'Setting default values for add comment section');

            $(selectors.commentsModal + ' input').val('');
        },

        _hideComments = function() {
            var functionName = moduleName + '.hideComments';
            logger.debug(functionName, 'Closing comments modal');

            lastNoteId = -1;

            projectInventory.module.modal.hide(selectors.commentsModal);

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

                    projectInventory.module.modal.show(selectors.noteEdit, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty project selection');

                    projectInventory.module.modal.show(selectors.noteEdit, false, false, false);
                });
        },

        _hideEdit = function() {
            var functionName = moduleName + '.hideEdit';
            logger.debug(functionName, 'Closing edit note modal');

            projectInventory.module.modal.hide(selectors.noteEdit);

            logger.info(functionName, 'Setting default form values for edit note modal');

            $(selectors.noteProjectEdit + ' select').html(elements.defaultOptionElement);
            $(selectors.noteEdit + ' input').val('');
        },

        _showDelete = function(id) {
            var functionName = moduleName + '.showDelete';
            logger.debug(functionName, 'Opening delete note modal');

            logger.info(functionName, 'Note selected for delete: [ ' + id + ', ' + name + ' ]');

            $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/notes/delete/' + id);
            $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.note.hideDelete()');

            projectInventory.module.modal.show(selectors.deleteModal, false, false, false);
        },

        _hideDelete = function() {
            var functionName = moduleName + '.hideDeleteModal';
            logger.debug(functionName, 'Closing delete note modal');

            projectInventory.module.modal.hide(selectors.deleteModal);

            $(selectors.deleteModal + ' :button').attr('onclick', '');
        };

    return {
        showSection     : _showSection,
        showAdd         : _showAdd,
        hideAdd         : _hideAdd,
        showComments    : _showComments,
        showAddComment  : _showAddComment,
        addComment      : _addComment,
        deleteComment   : _deleteComment,
        hideAddComment  : _hideAddComment,
        hideComments    : _hideComments,
        showEdit        : _showEdit,
        hideEdit        : _hideEdit,
        showDelete      : _showDelete,
        hideDelete      : _hideDelete
    }
}());

projectInventory.module.worktime = (function() {
    var moduleName = 'projectInventory.module.worktime',

        selectors = {
            projectSection: '#projectSection',
            noteSection: '#noteSection',
            worktimeSection: '#worktimeSection',
            worktimeExport: '#worktimeExport',
            worktimeProfileAdd: '#worktimeProfileAdd',
            worktimeAdd: '#worktimeAdd',
            worktimeProjectAdd: '#worktimeProjectAdd',
            worktime: '#worktime-',
            worktimeEdit: '#worktimeEdit',
            worktimeProjectEdit: '#worktimeProjectEdit',
            deleteModal : '#deleteModal'
        },

        elements = {
            defaultOptionElement : '<option value="-1">-</option>',
            optionElement : '<option value="{id}">{name}</option>'
        },

        _showSection = function() {
            var functionName = moduleName + '.showSection';
            logger.debug(functionName, 'Opening worktime section');

            $(selectors.projectSection).addClass('hidden');
            $(selectors.noteSection).addClass('hidden');
            $(selectors.worktimeSection).removeClass('hidden');

            projectInventory.app.updateActiveTab('left', projectInventory.app.getTabNames().left.WORKTIME);
        },

        getProfiles = function() {
            var functionName = moduleName + '.getProfiles';
            logger.debug(functionName, "Getting profiles from server");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + "/profiles/list",
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
                    .done(function(data) {
                        logger.info(functionName, "Profiles: " + JSON.stringify(data));

                        if (data.length == 0) {
                            logger.info(functionName, 'No profiles found!');
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

        _showExport = function() {
            var functionName = moduleName + '.showExport';
            logger.debug(functionName, 'Opening export modal');

            getDateTime(0).then(
                function(datetime) {
                    logger.info(functionName, 'Opening modal with start and end date info');

                    $(selectors.worktimeExport + ' .start-date').val(datetime.date);
                    $(selectors.worktimeExport + ' .start-time').val(datetime.time);
                    $(selectors.worktimeExport + ' .end-date').val(datetime.date);
                    $(selectors.worktimeExport + ' .end-time').val(datetime.time);
                },
                function() {
                    logger.info(functionName, 'Opening modal without start and end date info');
                });

            getProfiles().then(
                function(element) {
                    logger.info(functionName, 'Opening modal with profile selection');

                    $(selectors.worktimeProfileAdd + ' select').append(element);

                    projectInventory.module.modal.show(selectors.worktimeExport, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty profile selection');

                    $(selectors.worktimeExport + ' .innobyte-export').addClass('hidden');

                    projectInventory.module.modal.show(selectors.worktimeExport, false, false, false);
                });
        },

        _toggleCheckbox = function(name) {
            var functionName = moduleName + '.toggleCheckbox';
            logger.debug(functionName, 'Toggle checkboxes in export worktime modal');

            $(selectors.worktimeExport + ' input[type="checkbox"]').each(function() {
                if(!$(this).hasClass(name))
                    $(this).prop('checked', false);
            });
        },

        _icsExport = function() {},

        _innobyteExport = function() {},

        _tsystemsExport = function() {},

        _hideExport = function() {
            var functionName = moduleName + '.hideExport';
            logger.debug(functionName, 'Closing export worktime modal');

            projectInventory.module.modal.hide(selectors.worktimeExport);

            logger.info(functionName, 'Setting default form values for export worktime modal');

            $(selectors.worktimeProfileAdd + ' select').html(elements.defaultOptionElement);
            $(selectors.worktimeExport + ' input').val('');
            $(selectors.worktimeExport + ' input[type="checkbox"]').prop('checked', false);
        },

        getDateTimeFrom = function(startDatetime, plusHours) {
            var functionName = moduleName + '.getDateTimeFrom';
            logger.debug(functionName, "Getting datetime from server");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + "/home/now/datetime/" + startDatetime + '/' + plusHours,
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
                    .done(function(data) {
                        logger.info(functionName, "Datetime: " + data);

                        resolve({
                            date : data.split(' ')[0],
                            time : data.split(' ')[1]
                        });
                    })
                    .fail(function() {
                        logger.error(functionName, 'Cannot reach the server');
                        reject();
                    });
            });
        },

        _updateEndDateTime = function(element) {
            var functionName = moduleName + '.updateEndDateTime';

            var startDate = $('#' + element + ' .start-date').val();
            var startTime = $('#' + element + ' .start-time').val();

            getDateTimeFrom(startDate + ' ' + startTime, 1).then(
                function(datetime) {
                    logger.debug(functionName, 'Setting end datetime for ' + element);

                    $('#' + element + ' .end-date').val(datetime.date);
                    $('#' + element + ' .end-time').val(datetime.time);
                },
                function() {
                    logger.info(functionName, 'Cannot get datetime info');
                });
        },

        getDateTime = function(plusHours) {
            var functionName = moduleName + '.getDateTime';
            logger.debug(functionName, "Getting datetime from server");

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: projectInventory.app.appPath + "/home/now/datetime/" + plusHours,
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
                    .done(function(data) {
                        logger.info(functionName, "Datetime: " + data);

                        resolve({
                            date : data.split(' ')[0],
                            time : data.split(' ')[1]
                        });
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
                $.ajax({
                    url: projectInventory.app.appPath + "/projects/list",
                    method : 'GET',
                    timeout : projectInventory.app.timeout
                })
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
            logger.debug(functionName, 'Opening add worktime modal');

            getDateTime(0).then(
                function(datetime) {
                    logger.info(functionName, 'Opening modal with start date info');

                    $(selectors.worktimeAdd + ' .start-date').val(datetime.date);
                    $(selectors.worktimeAdd + ' .start-time').val(datetime.time);
                },
                function() {
                    logger.info(functionName, 'Opening modal without start date info');
                });

            getDateTime(1).then(
                function(datetime) {
                    logger.info(functionName, 'Opening modal with end date info');

                    $(selectors.worktimeAdd + ' .end-date').val(datetime.date);
                    $(selectors.worktimeAdd + ' .end-time').val(datetime.time);
                },
                function() {
                    logger.info(functionName, 'Opening modal without end date info');
                });

            createProjectSelection().then(
                function(element) {
                    logger.info(functionName, 'Opening modal with project selection');

                    $(selectors.worktimeProjectAdd + ' select').append(element);

                    projectInventory.module.modal.show(selectors.worktimeAdd, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty project selection');

                    projectInventory.module.modal.show(selectors.worktimeAdd, false, false, false);
                });
        },

        _hideAdd = function() {
            var functionName = moduleName + '.hideAdd';
            logger.debug(functionName, 'Closing add worktime modal');

            projectInventory.module.modal.hide(selectors.worktimeAdd);

            logger.info(functionName, 'Setting default form values for add worktime modal');

            $(selectors.worktimeProjectAdd + ' select').html(elements.defaultOptionElement);
            $(selectors.worktimeAdd + ' input').val('');
        },

        _showEdit = function(id) {
            var functionName = moduleName + '.showEdit';
            logger.debug(functionName, 'Opening edit worktime modal');

            var selectedRow = selectors.worktime + id;

            $(selectors.worktimeEdit + ' .id').val(id);
            $(selectors.worktimeEdit + ' .start-date').val($(selectedRow + ' .start-date').html());
            $(selectors.worktimeEdit + ' .start-time').val($(selectedRow + ' .start-time').html());
            $(selectors.worktimeEdit + ' .end-date').val($(selectedRow + ' .end-date').html());
            $(selectors.worktimeEdit + ' .end-time').val($(selectedRow + ' .end-time').html());
            $(selectors.worktimeEdit + ' .description').val($(selectedRow + ' .description').html());

            createProjectSelection().then(
                function(element) {
                    logger.info(functionName, 'Opening modal with project selection');

                    $(selectors.worktimeProjectEdit + ' select').append(element);
                    $(selectors.worktimeProjectEdit + ' select').val($(selectedRow + ' .project').attr('data'));

                    projectInventory.module.modal.show(selectors.worktimeEdit, false, false, false);
                },
                function() {
                    logger.info(functionName, 'Opening modal with empty project selection');

                    projectInventory.module.modal.show(selectors.worktimeEdit, false, false, false);
                });
        },

        _hideEdit = function() {
            var functionName = moduleName + '.hideEdit';
            logger.debug(functionName, 'Closing edit worktime modal');

            projectInventory.module.modal.hide(selectors.worktimeEdit);

            logger.info(functionName, 'Setting default form values for edit worktime modal');

            $(selectors.worktimeProjectEdit + ' select').html(elements.defaultOptionElement);
            $(selectors.worktimeEdit + ' input').val('');
        },

        _showDelete = function(id) {
            var functionName = moduleName + '.showDelete';
            logger.debug(functionName, 'Opening delete worktime modal');

            logger.info(functionName, 'Worktime selected for delete: [ ' + id + ' ]');

            $(selectors.deleteModal + ' form').attr('action', projectInventory.app.appPath + '/worktimes/delete/' + id);
            $(selectors.deleteModal + ' :button').attr('onclick', 'projectInventory.module.worktime.hideDelete()');

            projectInventory.module.modal.show(selectors.deleteModal, false, false, false);
        },

        _hideDelete = function() {
            var functionName = moduleName + '.hideDeleteModal';
            logger.debug(functionName, 'Closing delete worktime modal');

            projectInventory.module.modal.hide(selectors.deleteModal);

            $(selectors.deleteModal + ' :button').attr('onclick', '');
        };

    return {
        showSection         : _showSection,
        showExport          : _showExport,
        toggleCheckbox      : _toggleCheckbox,
        icsExport           : _icsExport,
        innobyteExport      : _innobyteExport,
        tsystemsExport      : _tsystemsExport,
        hideExport          : _hideExport,
        updateEndDateTime   : _updateEndDateTime,
        showAdd             : _showAdd,
        hideAdd             : _hideAdd,
        showEdit            : _showEdit,
        hideEdit            : _hideEdit,
        showDelete          : _showDelete,
        hideDelete          : _hideDelete
    }
}());

$(function() {
    projectInventory.app.init();
});