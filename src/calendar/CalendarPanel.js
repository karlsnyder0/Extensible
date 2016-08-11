/**
 * This is the default container for calendar views. It supports day, week, multi-week and month views as well
 * as a built-in event edit form. The only requirement for displaying a calendar is passing in a valid
 * {@link #Ext.data.Store store} config containing records of type
 * {@link Extensible.calendar.data.EventModel EventRModel}.
 */
Ext.define('Extensible.calendar.CalendarPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.extensible.calendarpanel',
    
    requires: [
        'Ext.layout.container.Card',
        'Extensible.calendar.view.Day',
        'Extensible.calendar.view.Week',
        'Extensible.calendar.view.Month',
        'Extensible.calendar.view.MultiDay',
        'Extensible.calendar.view.MultiWeek'
    ],
    
    /**
     * @cfg {Number} activeItem
     * The 0-based index within the available views to set as the default active view (defaults to undefined).
     * If not specified the default view will be set as the last one added to the panel. You can retrieve a
     * reference to the active {@link Extensible.calendar.view.AbstractCalendar view} at any time using the
     * {@link #activeView} property.
     */
    /**
     * @cfg {Boolean} recurrence
     * True to enable event recurrence, false to disable it (default). Note that at this time this
     * requires handling code on the server-side that can parse the iCal RRULE format in order to generate
     * the instances of recurring events to display on the calendar, so this field should only be enabled
     * if the server supports it.
     */
    recurrence: false,
    /**
     * @cfg {Boolean} showDayView
     * True to include the day view (and toolbar button), false to hide them (defaults to true).
     */
    showDayView: true,
    /**
     * @cfg {Boolean} showMultiDayView
     * True to include the multi-day view (and toolbar button), false to hide them (defaults to false).
     */
    showMultiDayView: false,
    /**
     * @cfg {Boolean} showWeekView
     * True to include the week view (and toolbar button), false to hide them (defaults to true).
     */
    showWeekView: true,
    /**
     * @cfg {Boolean} showMultiWeekView
     * True to include the multi-week view (and toolbar button), false to hide them (defaults to true).
     */
    showMultiWeekView: true,
    /**
     * @cfg {Boolean} showMonthView
     * True to include the month view (and toolbar button), false to hide them (defaults to true).
     * If all other views are hidden, the month view will show by default even if this config is false.
     */
    showMonthView: true,
    /**
     * @cfg {Boolean} showNavBar
     * True to display the calendar navigation toolbar, false to hide it (defaults to true). Note that
     * if you hide the default navigation toolbar you'll have to provide an alternate means of navigating
     * the calendar.
     */
    showNavBar: true,
    /**
     * @cfg {String} todayText
     * Text to use for the 'Today' nav bar button.
     */
    todayText: 'Today',
    /**
     * @cfg {Boolean} showTodayText
     * True to show the value of {@link #todayText} instead of today's date in the calendar's current day box,
     * false to display the day number(defaults to true).
     */
    showTodayText: true,
    /**
     * @cfg {Boolean} showTime
     * True to display the current time next to the date in the calendar's current day box, false to not show it
     * (defaults to true).
     */
    showTime: true,
    /**
     * @cfg {Boolean} readOnly
     * True to prevent clicks on events or calendar views from providing CRUD capabilities, false to enable CRUD
     * (the default). This option is passed into all views managed by this CalendarPanel.
     */
    readOnly: false,
    /**
     * @cfg {Boolean} showNavToday
     * True to display the "Today" button in the calendar panel's navigation header, false to not
     * show it (defaults to true).
     */
    showNavToday: true,
    /**
     * @cfg {Boolean} showNavJump
     * True to display the "Jump to:" label in the calendar panel's navigation header, false to not
     * show it (defaults to true).
     */
    showNavJump: true,
    /**
     * @cfg {Boolean} showNavNextPrev
     * True to display the left/right arrow buttons in the calendar panel's navigation header, false to not
     * show it (defaults to true).
     */
    showNavNextPrev: true,
    /**
     * @cfg {String} jumpToText
     * Text to use for the 'Jump to:' navigation label.
     */
    jumpToText: 'Jump to:',
    /**
     * @cfg {String} goText
     * Text to use for the 'Go' navigation button.
     */
    goText: 'Go',
    /**
     * @cfg {String} dayText
     * Text to use for the 'Day' nav bar button.
     */
    dayText: 'Day',
    /**
     * @cfg {String} multiDayText
     * **Deprecated.** Please override {@link #getMultiDayText} instead.
     * 
     * Text to use for the 'X Days' nav bar button (defaults to "{0} Days" where {0} is automatically
     * replaced by the value of the {@link #multDayViewCfg}'s dayCount value if available, otherwise it
     * uses the view default of 3).
     * @deprecated
     */
    multiDayText: '{0} Days',
    /**
     * @cfg {String} weekText
     * Text to use for the 'Week' nav bar button.
     */
    weekText: 'Week',
    /**
     * @cfg {String} multiWeekText
     * **Deprecated.** Please override {@link #getMultiWeekText} instead.
     * 
     * Text to use for the 'X Weeks' nav bar button (defaults to "{0} Weeks" where {0} is automatically
     * replaced by the value of the {@link #multiWeekViewCfg}'s weekCount value if available, otherwise it
     * uses the view default of 2).
     * @deprecated
     */
    multiWeekText: '{0} Weeks',
    /**
     * @cfg {String} monthText
     * Text to use for the 'Month' nav bar button.
     */
    monthText: 'Month',
    /**
     * @cfg {Boolean} editModal
     * True to show the default event editor window modally over the entire page, false to allow user
     * interaction with the page while showing the window (the default). Note that if you replace the
     * default editor window with some alternate component this config will no longer apply.
     */
    editModal: false,
    /**
     * @cfg {Boolean} enableEditDetails
     * True to show a link on the event edit window to allow switching to the detailed edit form (the
     * default), false to remove the link and disable detailed event editing.
     */
    enableEditDetails: true,
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay: 0,
    /**
     * @cfg {Ext.data.Store} eventStore
     * The {@link Ext.data.Store store} which is bound to this calendar and contains
     * {@link Extensible.calendar.data.EventModel EventModels}. Note that this is an alias to the
     * default {@link #store} config (to differentiate that from the optional {@link #calendarStore}
     * config), and either can be used interchangeably.
     */
    /**
     * @cfg {Ext.data.Store} calendarStore
     * The {@link Ext.data.Store store} which is bound to this calendar and contains
     * {@link Extensible.calendar.data.CalendarModel CalendarModelss}. This is an optional store that
     * provides multi-calendar (and multi-color) support. If available an additional field for selecting
     * the calendar in which to save an event will be shown in the edit forms. If this store is not
     * available then all events will simply use the default calendar (and color).
     */
    /**
     * @cfg {Object} viewConfig
     * A config object that will be applied to all {@link Extensible.calendar.view.AbstractCalendar views}
     * managed by this CalendarPanel. Any options on this object that do not apply to any particular view
     * will simply be ignored.
     */
    /**
     * @cfg {Object} dayViewCfg
     * A config object that will be applied only to the {@link Extensible.calendar.view.Day DayView}
     * managed by this CalendarPanel.
     */
    /**
     * @cfg {Object} multiDayViewCfg
     * A config object that will be applied only to the {@link Extensible.calendar.view.MultiDay MultiDayView}
     * managed by this CalendarPanel.
     */
    /**
     * @cfg {Object} weekViewCfg
     * A config object that will be applied only to the {@link Extensible.calendar.view.Week WeekView}
     * managed by this CalendarPanel.
     */
    /**
     * @cfg {Object} multiWeekViewCfg
     * A config object that will be applied only to the {@link Extensible.calendar.view.MultiWeek MultiWeekView}
     * managed by this CalendarPanel.
     */
    /**
     * @cfg {Object} monthViewCfg
     * A config object that will be applied only to the {@link Extensible.calendar.view.Month MonthView}
     * managed by this CalendarPanel.
     */
    /**
     * @cfg {Object} editViewCfg
     * A config object that will be applied only to the {@link Extensible.calendar.form.EventDetails
     * EventEditForm} managed by this CalendarPanel.
     */
    
    /**
     * A reference to the {@link Extensible.calendar.view.AbstractCalendar view} that is currently active.
     * @type {Extensible.calendar.view.AbstractCalendar}
     * @property activeView
     */

    layout: {
        type: 'card',
        deferredRender: true
    },
    
    // private property
    startDate: new Date(),

    initComponent: function() {
        this.tbar = {
            cls: 'ext-cal-toolbar',
            border: true,
            items: []
        };
        
        this.viewCount = 0;
        
        var text,
            multiDayViewCount = (this.multiDayViewCfg && this.multiDayViewCfg.dayCount) || 3,
            multiWeekViewCount = (this.multiWeekViewCfg && this.multiWeekViewCfg.weekCount) || 2;
        
        //
        // TODO: Pull the configs for the toolbar/buttons out to the prototype for overrideability
        //
        if(this.showNavToday) {
            this.tbar.items.push({
                id: this.id+'-tb-today', text: this.todayText, handler: this.onTodayClick, scope: this
            });
        }
        if(this.showNavNextPrev) {
            this.tbar.items.push({id: this.id+'-tb-prev', handler: this.onPrevClick, scope: this, iconCls: 'x-tbar-page-prev'});
            this.tbar.items.push({id: this.id+'-tb-next', handler: this.onNextClick, scope: this, iconCls: 'x-tbar-page-next'});
        }
        if(this.showNavJump) {
            this.tbar.items.push(this.jumpToText);
            this.tbar.items.push({id: this.id+'-tb-jump-dt', xtype: 'datefield', width: 120, showToday: false, startDay: this.startDay});
            this.tbar.items.push({id: this.id+'-tb-jump', text: this.goText, handler: this.onJumpClick, scope: this});
        }
        
        this.tbar.items.push('->');
        
        if(this.showDayView) {
            this.tbar.items.push({
                id: this.id+'-tb-day', text: this.dayText, handler: this.onDayNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMultiDayView) {
            text = Ext.String.format(this.getMultiDayText(multiDayViewCount), multiDayViewCount);
            this.tbar.items.push({
                id: this.id+'-tb-multiday', text: text, handler: this.onMultiDayNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showWeekView) {
            this.tbar.items.push({
                id: this.id+'-tb-week', text: this.weekText, handler: this.onWeekNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMultiWeekView) {
            text = Ext.String.format(this.getMultiWeekText(multiWeekViewCount), multiWeekViewCount);
            this.tbar.items.push({
                id: this.id+'-tb-multiweek', text: text, handler: this.onMultiWeekNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
        }
        if(this.showMonthView || this.viewCount === 0) {
            this.tbar.items.push({
                id: this.id+'-tb-month', text: this.monthText, handler: this.onMonthNavClick, scope: this, toggleGroup: this.id+'-tb-views'
            });
            this.viewCount++;
            this.showMonthView = true;
        }
        
        var idx = this.viewCount-1;
        this.activeItem = (this.activeItem === undefined ? idx : (this.activeItem > idx ? idx : this.activeItem));
        
        if(this.showNavBar === false) {
            delete this.tbar;
            this.addCls('x-calendar-nonav');
        }
        
        this.callParent(arguments);
                
        this.addCls('x-cal-panel');
        
        if(this.eventStore) {
            this.store = this.eventStore;
            delete this.eventStore;
        }
        this.setStore(this.store);
        
        var sharedViewCfg = {
            showToday: this.showToday,
            todayText: this.todayText,
            showTodayText: this.showTodayText,
            showTime: this.showTime,
            readOnly: this.readOnly,
            recurrence: this.recurrence,
            store: this.store,
            calendarStore: this.calendarStore,
            editModal: this.editModal,
            enableEditDetails: this.enableEditDetails,
            startDay: this.startDay,
            ownerCalendarPanel: this
        };
        
        if(this.showDayView) {
            var day = Ext.apply({
                xtype: 'extensible.dayview',
                title: this.dayText
            }, sharedViewCfg);
            
            day = Ext.apply(Ext.apply(day, this.viewConfig), this.dayViewCfg);
            day.id = this.id+'-day';
            this.initEventRelay(day);
            this.add(day);
        }
        if(this.showMultiDayView) {
            var mday = Ext.apply({
                xtype: 'extensible.multidayview',
                title: this.getMultiDayText(multiDayViewCount)
            }, sharedViewCfg);
            
            mday = Ext.apply(Ext.apply(mday, this.viewConfig), this.multiDayViewCfg);
            mday.id = this.id+'-multiday';
            this.initEventRelay(mday);
            this.add(mday);
        }
        if(this.showWeekView) {
            var wk = Ext.applyIf({
                xtype: 'extensible.weekview',
                title: this.weekText
            }, sharedViewCfg);
            
            wk = Ext.apply(Ext.apply(wk, this.viewConfig), this.weekViewCfg);
            wk.id = this.id+'-week';
            this.initEventRelay(wk);
            this.add(wk);
        }
        if(this.showMultiWeekView) {
            var mwk = Ext.applyIf({
                xtype: 'extensible.multiweekview',
                title: this.getMultiWeekText(multiWeekViewCount)
            }, sharedViewCfg);
            
            mwk = Ext.apply(Ext.apply(mwk, this.viewConfig), this.multiWeekViewCfg);
            mwk.id = this.id+'-multiweek';
            this.initEventRelay(mwk);
            this.add(mwk);
        }
        if(this.showMonthView) {
            var month = Ext.applyIf({
                xtype: 'extensible.monthview',
                title: this.monthText,
                listeners: {
                    'weekclick': {
                        fn: function(vw, dt) {
                            this.showWeek(dt);
                        },
                        scope: this
                    }
                }
            }, sharedViewCfg);
            
            month = Ext.apply(Ext.apply(month, this.viewConfig), this.monthViewCfg);
            month.id = this.id+'-month';
            this.initEventRelay(month);
            this.add(month);
        }

        this.add(Ext.applyIf({
            xtype: 'extensible.eventeditform',
            id: this.id+'-edit',
            calendarStore: this.calendarStore,
            recurrence: this.recurrence,
            startDay: this.startDay,
            listeners: {
                'eventadd':    { scope: this, fn: this.onEventAdd },
                'eventupdate': { scope: this, fn: this.onEventUpdate },
                'eventdelete': { scope: this, fn: this.onEventDelete },
                'eventcancel': { scope: this, fn: this.onEventCancel }
            }
        }, this.editViewCfg));
    },

    initEventRelay: function(cfg) {
        cfg.listeners = cfg.listeners || {};
        cfg.listeners.afterrender = {
            fn: function(c) {
                // Relay view events so that app code only has to handle them in one place.
                // These events require no special handling by the calendar panel.
                this.relayEvents(c, ['eventsrendered', 'eventclick', 'dayclick', 'eventover', 'eventout',
                    'beforedatechange', 'datechange', 'rangeselect', 'beforeeventcopy', 'eventcopy',
                    'beforeeventmove', 'eventmove', 'initdrag', 'dayover', 'dayout', 'beforeeventresize',
                    'eventresize', 'eventadd', 'eventupdate', 'beforeeventdelete', 'eventdelete',
                    'eventcancel', 'eventexception']);
                
                c.on('editdetails', this.onEditDetails, this);
            },
            scope: this,
            single: true
        };
    },

    afterRender: function() {
        this.callParent(arguments);
        
        this.body.addCls('x-cal-body');
        this.updateNavState();
        this.setActiveView();
    },
    
    /**
     * Returns the text to use for the 'X Days' nav bar button (defaults to "{0} Days" where {0} is automatically replaced by the
     * value of the {@link #multDayViewCfg}'s dayCount value if available, otherwise it uses the view default of 3).
     */
    getMultiDayText: function(numDays) {
        return this.multiDayText;
    },
    
    /**
     * Returns the text to use for the 'X Weeks' nav bar button (defaults to "{0} Weeks" where {0} is automatically replaced by the
     * value of the {@link #multiWeekViewCfg}'s weekCount value if available, otherwise it uses the view default of 2).
     */
    getMultiWeekText: function(numWeeks) {
        return this.multiWeekText;
    },
    
    /**
     * Sets the event store used by the calendar to display {@link Extensible.calendar.data.EventModel events}.
     * @param {Ext.data.Store} store
     */
    setStore: function(store, initial) {
        var currStore = this.store;
        
        if(!initial && currStore) {
            currStore.un("write", this.onWrite, this);
        }
        if(store) {
            store.on("write", this.onWrite, this);
        }
        this.store = store;
    },

    onStoreAdd: function(ds, recs, index) {
        this.hideEditForm();
    },

    onStoreUpdate: function(ds, rec, operation) {
        if(operation === Ext.data.Record.COMMIT) {
            this.hideEditForm();
        }
    },

    onStoreRemove: function(ds, rec) {
        this.hideEditForm();
    },

    onWrite: function(store, operation) {
        var rec = operation.records[0];
        
        switch(operation.action) {
            case 'create':
                this.onStoreAdd(store, rec);
                break;
            case 'update':
                this.onStoreUpdate(store, rec, Ext.data.Record.COMMIT);
                break;
            case 'destroy':
                this.onStoreRemove(store, rec);
                break;
        }
    },

    onEditDetails: function(vw, rec, el) {
        if(this.fireEvent('editdetails', this, vw, rec, el) !== false) {
            this.showEditForm(rec);
        }
    },

    save: function() {
        // If the store is configured as autoSync:true the record's endEdit
        // method will have already internally caused a save to execute on
        // the store. We only need to save manually when autoSync is false,
        // otherwise we'll create duplicate transactions.
        if(!this.store.autoSync) {
            this.store.sync();
        }
    },

    onEventAdd: function(form, rec) {
        if(!rec.store) {
            this.store.add(rec);
            this.save();
        }
        this.fireEvent('eventadd', this, rec);
    },

    onEventUpdate: function(form, rec) {
        this.save();
        this.fireEvent('eventupdate', this, rec);
    },

    onEventDelete: function(form, rec) {
        this.store.remove(rec);
        this.save();
        this.fireEvent('eventdelete', this, rec);
    },

    onEventCancel: function(form, rec) {
        this.hideEditForm();
        this.fireEvent('eventcancel', this, rec);
    },
    
    /**
     * Shows the built-in event edit form for the passed in event record.  This method automatically
     * hides the calendar views and navigation toolbar.  To return to the calendar, call {@link #hideEditForm}.
     * @param {Extensible.calendar.data.EventModel} record The event record to edit
     * @return {Extensible.calendar.CalendarPanel} this
     */
    showEditForm: function(rec) {
        this.preEditView = this.layout.getActiveItem().id;
        this.setActiveView(this.id+'-edit');
        this.layout.getActiveItem().loadRecord(rec);
        return this;
    },
    
    /**
     * Hides the built-in event edit form and returns to the previous calendar view. If the edit form is
     * not currently visible this method has no effect.
     * @return {Extensible.calendar.CalendarPanel} this
     */
    hideEditForm: function() {
        if(this.preEditView) {
            this.setActiveView(this.preEditView);
            delete this.preEditView;
        }
        return this;
    },
    
    /**
     * Set the active view, optionally specifying a new start date.
     * @param {String/Number} id The id of the view to activate (or the 0-based index of the view within 
     * the CalendarPanel's internal card layout).
     * @param {Date} startDate (optional) The new view start date (defaults to the current start date)
     */
    setActiveView: function(id, startDate) {
        var me = this,
            layout = me.layout,
            editViewId = me.id + '-edit',
            toolbar;
        
        if (startDate) {
            me.startDate = startDate;
        }
        
        // Make sure we're actually changing views
        if (id !== layout.getActiveItem().id) {
            // Show/hide the toolbar first so that the layout will calculate the correct item size
            toolbar = me.getDockedItems('toolbar')[0];
            if (toolbar) {
                toolbar[id === editViewId ? 'hide' : 'show']();
            }
            
            // Activate the new view and refresh the layout
            layout.setActiveItem(id || me.activeItem);
            me.updateLayout();
            me.activeView = layout.getActiveItem();
            
            if (id !== editViewId) {
                if (id && id !== me.preEditView) {
                    // We're changing to a different view, so the view dates are likely different.
                    // Re-set the start date so that the view range will be updated if needed.
                    // If id is undefined, it means this is the initial pass after render so we can
                    // skip this (as we don't want to cause a duplicate forced reload).
                    layout.activeItem.setStartDate(me.startDate, true);
                }
                // Switching to a view that's not the edit view (i.e., the nav bar will be visible)
                // so update the nav bar's selected view button
                me.updateNavState();
            }
            // Notify any listeners that the view changed
            me.fireViewChange();
        }
    },

    fireViewChange: function() {
        if (this.layout && this.layout.getActiveItem) {
            var view = this.layout.getActiveItem(),
                cloneDt = Ext.Date.clone;
                
            if (view) {
                var info;
                
                // some views do not have these properties, e.g. the detailed edit form
                if (view.getViewBounds) {
                    var vb = view.getViewBounds();
                    info = {
                        viewStart: cloneDt(vb.start),
                        viewEnd: cloneDt(vb.end),
                        activeDate: cloneDt(view.getStartDate())
                    };
                }
                if (view.dismissEventEditor) {
                    view.dismissEventEditor();
                }
                this.fireEvent('viewchange', this, view, info);
            }
        }
    },

    updateNavState: function() {
        var me = this,
            activeItem = me.layout.activeItem;
        
        if (activeItem && me.showNavBar !== false) {
            var suffix = activeItem.id.split(me.id + '-')[1],
                btn = Ext.getCmp(me.id + '-tb-' + suffix);
            
            if (me.showNavToday) {
                Ext.getCmp(me.id + '-tb-today').setDisabled(activeItem.isToday());
            }
            btn.toggle(true);
        }
    },

    /**
     * Sets the start date for the currently-active calendar view.
     * @param {Date} dt The new start date
     * @return {Extensible.calendar.CalendarPanel} this
     */
    setStartDate: function(dt) {
        Extensible.log('setStartDate (CalendarPanel');
        this.startDate = dt;
        this.layout.activeItem.setStartDate(dt, true);
        this.updateNavState();
        this.fireViewChange();
        return this;
    },

    showWeek: function(dt) {
        this.setActiveView(this.id+'-week', dt);
    },

    onTodayClick: function() {
        this.startDate = this.layout.activeItem.moveToday(true);
        this.updateNavState();
        this.fireViewChange();
    },

    onJumpClick: function() {
        var dt = Ext.getCmp(this.id+'-tb-jump-dt').getValue();
        if(dt !== '') {
            this.startDate = this.layout.activeItem.moveTo(dt, true);
            this.updateNavState();
            // TODO: check that view actually changed:
            this.fireViewChange();
        }
    },

    onPrevClick: function() {
        this.startDate = this.layout.activeItem.movePrev(true);
        this.updateNavState();
        this.fireViewChange();
    },

    onNextClick: function() {
        this.startDate = this.layout.activeItem.moveNext(true);
        this.updateNavState();
        this.fireViewChange();
    },

    onDayNavClick: function() {
        this.setActiveView(this.id+'-day');
    },

    onMultiDayNavClick: function() {
        this.setActiveView(this.id+'-multiday');
    },

    onWeekNavClick: function() {
        this.setActiveView(this.id+'-week');
    },

    onMultiWeekNavClick: function() {
        this.setActiveView(this.id+'-multiweek');
    },

    onMonthNavClick: function() {
        this.setActiveView(this.id+'-month');
    },
    
    /**
     * Return the calendar view that is currently active, which will be a subclass of
     * {@link Extensible.calendar.view.AbstractCalendar AbstractCalendar}.
     * @return {Extensible.calendar.view.AbstractCalendar} The active view
     */
    getActiveView: function() {
        return this.layout.activeItem;
    }
});