/*
WindowSetup Class
-------------
- This class provides basic features to make a <div> that functions similar to a desktop window.
*/

// Create global XState variable
const { Machine, interpret } = XState;

class Window
{
    
    constructor(_windowId)
    {
        // Define the window
        this.window = _windowId;

        // Window content
        this.windowTitle = 'Window Title';
        this.windowContent = 'Window Content';

        // Initial window sizing
        this.minWidth = 300;
        this.minHeight = 200;
        this.width = '50em';
        this.height = '25em';

        // Window bar buttons
        this.minimize = true;
        this.sizeToggle = true;
        this.close = true;

        // Containment that windows can't be dragged out of
        this.containment = 'body';
        $(this.containment).css('position', 'relative');
        this.containmentCenterX = 0;
        this.containmentCenterY = 0;

        // Set launcher
        this.launcher = '';
        this.initialState = 'create';

        // Fullscreen swapping
        this.lastPosition = null;
        this.lastWidth = '50em';
        this.lastHeight = '25em';
        this.transitionTime = 0.3;
        

        // On document ready, make things dynamic
        $( () =>
        {
            // Create state machine
            const stateMachine = Machine({
                initial: this.initialState,
                states: {

                    // Launch and open window
                    create: {
                        // null event, switch to open
                        on: {'': 'open'},
                        entry: ['createWindow']
                    },

                    // Open window state
                    open: {
                        // Sub-states in the 'open' state
                        initial: 'windowed',
                        states: {
                            windowed: {
                                on: {
                                    sizeToggle: {
                                        target: 'maximized',
                                    }
                                },
                                entry: ['makeWindowed'],
                                exit: ['storeSizeAndPosition']
                            },
                            maximized: {
                                on: {
                                    sizeToggle: {
                                        target: 'windowed'
                                    }
                                },
                                entry: ['makeMaximized']
                            },
                            // Used to return to last open substate, when 'un-minimizing' a window
                            hist: {
                                type: 'history',
                                history: 'shallow'
                            },
                        },

                        // Actions on the 'open' state
                        on: {
                            minimize: {
                                target: 'minimized'
                            },
                            launch: {
                                target: 'minimized'
                            },
                            close: {
                                target: 'closed'
                            }
                        }
                    },

                    // Minimized state
                    minimized: {
                        on: {
                            launch: {
                                target: 'open.hist'
                            }
                        },
                        entry: ['makeMinimized'],
                        exit: ['undoMinimized']
                    },

                    // Closed state
                    closed: {
                        on: {
                            launch: {
                                target: 'create'
                            }
                        },
                        entry: ['closeWindow']
                    },

                }
            },
            {
                actions: {
                    createWindow: (context, event) => {
                        // Draw new window into the containment
                        $(this.containment).append(this.drawWindow());
                        $(this.window).css('width', this.width);
                        $(this.window).css('height', this.height);
                        // Change css positioning in JavaScript because jQuery UI constantly overwrites with position:relative
                        $(this.window).css('position', 'absolute');
                        // Center the window
                        this.centerWindow();
                        // Enable dragging and resize, and listen for clicks on buttons
                        this.dragAndResize();
                        this.windowInteraction();

                        // Make the launcher respond
                        $(this.launcher).addClass('launcher-open');
                    },
                    storeSizeAndPosition: (context, event) => {
                        this.lastPosition = $(this.window).position();
                        this.lastWidth = $(this.window).css('width');
                        this.lastHeight = $(this.window).css('height');
                    },
                    makeWindowed: (context, event) => {
                        this.makeWindowed()
                    },
                    makeMaximized: (context, event) => {
                        this.makeMaximized()
                    },
                    makeMinimized: (context, event) => {
                        // Up the transition speed
                        $(this.window).css('transition', String(this.transitionTime) + 's');
                        // Shrink and disappear
                        $(this.window).css('opacity', '0');
                        $(this.window).css('height', '100');
                        // Move to bottom
                        $(this.window).css('z-index', '0');

                        // Make the launcher respond
                        $(this.launcher).removeClass('launcher-open');
                        $(this.launcher).addClass('launcher-minimized');
                    },
                    undoMinimized: (context, event) => {
                        // Make visible, give normal height
                        $(this.window).css('opacity', '1');
                        $(this.window).css('height', '200');

                        // Move to bottom
                        $(this.window).css('z-index', '0');

                        // Make the launcher respond
                        $(this.launcher).removeClass('launcher-minimized');
                        $(this.launcher).addClass('launcher-open');
                    },
                    closeWindow: (context, event) => {
                        this.lastPosition = null;
                        this.lastWidth = null;
                        this.lastHeight = null;
                        
                        // Delete the element
                        $(this.window).remove();

                        // Make launcher not open
                        $(this.launcher).removeClass('launcher-open');
                    }
                }
            });

            // Start machine service
            this.machineService = interpret(stateMachine)
                .onTransition( state=> {console.log(state.value)} )
                .start();

            // Listen for launcher
            // Can't be in 'create', otherwise launchers are compounded each 'create'
            $(this.launcher).on('click', () =>
            {
                this.machineService.send('launch');
            });
        
        });
    }

    
    /*
    Responsive Features
    --------------------
    */

    windowInteraction()
    {
        // Minimize
        $(this.window + ' #window-minimize').on('click', () =>
        {
            this.machineService.send('minimize');
        });

        // Size toggle
        $(this.window + ' #size-toggle').on('click', () =>
        {
            this.machineService.send('sizeToggle');
        });

        // Close
        $(this.window + ' #window-close').on('click', () =>
        {
            this.machineService.send('close');
        });
    }

    // Enable dragging and resize
    dragAndResize(_containment)
    {
        $(this.window).draggable({
            containment: this.containment,
            scroll: false,
            start: () =>
            {
                this.bringToFront();
            }
        }).resizable({
            minWidth: this.minWidth,
            minHeight: this.minHeight,
        }).on('click', () => {
            this.bringToFront();
        });
    }

    // Bring the clicked on window to the front of all windows!
    bringToFront()
    {
        $('.window').css('z-index', '1');
        $(this.window).css('z-index', '2');
    }

    // Put window in center of containment, and make default size
    centerWindow()
    {
        // Find the center of this new container
        var offset = $(this.containment).offset();
        var containerWidth = $(this.containment).width();
        var containerHeight = $(this.containment).height();

        var centerX = (offset.left + containerWidth / 2) - $(this.window).width() / 2;
        var centerY = (offset.top + containerHeight / 2) - $(this.window).height() / 2;

        $(this.window).css('left', centerX);
        $(this.window).css('top', centerY);
    }

    makeMaximized()
    {
        // Up the transition speed, and reset it back to zero for smooth dragging
        $(this.window).css('transition', String(this.transitionTime) + 's');
        setTimeout( () => { $(this.window).css('transition', '0s'); }, (this.transitionTime * 100) );

        // Make borderless
        $(this.window).addClass('borderless');

        // Make the window fill the containment
        $(this.window).css('left', $(this.containment).position().left);
        $(this.window).css('top',  $(this.containment).position().top);
        $(this.window).css('width', $(this.containment).width());
        $(this.window).css('height', $(this.containment).height());
    }

    makeWindowed()
    {
        // Up the transition speed, and reset it back to zero for smooth dragging
        $(this.window).css('transition', String(this.transitionTime) + 's');
        setTimeout( () => { $(this.window).css('transition', '0s'); }, (this.transitionTime * 100) );

        // Add the border back
        $(this.window).removeClass('borderless');

        // Make the window windowed and set to last pos and size
        if (this.lastPosition != null)
        {
            $(this.window).css('left', this.lastPosition.left);
            $(this.window).css('top', this.lastPosition.top);
            $(this.window).css('width', this.lastWidth);
            $(this.window).css('height', this.lastHeight);
        }
    }

    /*
    User Setters
    --------
    */
    
    setTitle(_title)
    {
        this.windowTitle = _title;
    }

    setSize(_minWidth, _minHeight, _width, _height)
    {
        this.minWidth = _minWidth;
        this.minHeight = _minHeight;
        this.width = _width;
        this.height = _height;
    }

    setContent(_content)
    {
        this.windowContent = _content;
    }

    setContainment(_containment)
    {
        this.containment = _containment;
    }

    setLauncher(_launcher)
    {
        this.launcher = _launcher;
    }

    startOpen(_bool)
    {
        if (!_bool)
        {
            this.initialState = 'closed';
        }
    }

    allowButtons(_minimizeBool, _sizeToggleBool, _closeBool)
    {
        // Set to false to disable any of these buttons
        this.minimize = _minimizeBool;
        this.sizeToggle = _sizeToggleBool;
        this.close = _closeBool;
    }

    /*
    Draw Window
    ------------
    */

    drawWindow()
    {   
        var _buttonHtml = '';
        if (this.minimize)
        {
            _buttonHtml += `<span id='window-minimize'><i class='fas fa-minus fa-xs'></i></span>`;
        }
        if (this.sizeToggle)
        {
            _buttonHtml += `<span id='size-toggle'><i class='far fa-square fa-xs'></i></span>`;
        }
        if (this.close)
        {
            _buttonHtml += `<span id='window-close'><i class='fas fa-times-circle' style='color: rgb(223, 74, 22);'></i></span>`;
        }
        var _html = `
            <div id='` + this.window.substring(1) + `' class='window'>
                <!-- Window bar -->
                <div class='window-bar'>
                    <div class='row h-100'>
                        <!-- Left Placeholder/Padding -->
                        <div class='col'>

                        </div>
                        <!-- Title -->
                        <div class='col h-100 d-flex justify-content-center align-items-center'>
                            <p>` + this.windowTitle + `</p>
                        </div>
                        <!-- Buttons -->
                        <div class='col h-100 d-flex justify-content-end'>
                            ` + _buttonHtml + `
                        </div>
                    </div>
                </div>

                <!-- Window Content -->
                <div class='window-content'>
                    ` + this.windowContent + `
                </div>
            </div>
        `;
        return _html;
    }

}
