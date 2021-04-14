/*
WindowSetup Class
-------------
- This class provides basic features to make a <div> function similar to a desktop window.
- Features include: Dragging, resizing, bring to front, close, minimize, full screen.
*/

// Create global XState variable
const { Machine, interpret } = XState;

class WindowSetup
{
    
    constructor(_windowId)
    {
        // Define the window
        this.window = _windowId;
        // Window content
        this.windowTitle = "Window Title";
        this.windowContent = "Window Content";

        // Initial window sizing
        this.minWidth = 300;
        this.minHeight = 200;
        this.width = "50em";
        this.height = "25em";

        // Containment that windows can't be dragged out of
        this.containment = "body";
        $(this.containment).css("position", "relative");
        this.containmentCenterX = 0;
        this.containmentCenterY = 0;

        // Set launcher
        this.launcher = "body";

        // Fullscreen swapping
        this.fullScreen = false;
        this.lastPosition = $(this.window).position;
        this.lastWidth = "50em";
        this.lastHeight = "25em";
        this.transitionTime = 0.3;

        

        // On document ready, make things dynamic
        $( () =>
        {
        
            // Insert "dynamic" HTML and CSS into the window
            $(this.window).addClass("window");
            $(this.window).css("position", "absolute"); // Must add this in js because jQuery UI overwrites with position:relative
            $(this.window).html(this.drawWindow());
            // Center the window on load
            this.centerWindow();

            // Create state machine
            const stateMachine = Machine({
                initial: 'open',
                states: {

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
                                entry: ['makeWindowed']
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
                        entry: ['makeMinimized']
                    },

                    closed: {
                        on: {
                            launch: {
                                target: 'open'
                            }
                        },
                        entry: ['close']
                    },

                }
            },
            {
                actions: {
                    makeWindowed: (context, event) => {
                        this.makeWindowed()
                    },
                    makeMaximized: (context, event) => {
                        this.makeMaximized()
                    },
                    makeMinimized: (context, event) => {
                        // Up the transition speed
                        $(this.window).css("transition", String(this.transitionTime) + "s");
                        // Shrink and disappear
                        $(this.window).css("opacity", "0");
                        $(this.window).css("height", "100");
                        // Move to bottom
                        $(this.window).css("z-index", "0");
                    },
                    close: (context, event) => {
                        // Delete the element
                        $(this.window).remove();
                    }
                }
            });

            // Setup service
            this.machineService = interpret(stateMachine)
                .onTransition( state=> {console.log(state.value)} )
                .start();
        

            // Trigger the state machine service on user actions!
            // Minimize
            $(this.window + " #window-minimize").on('click', () =>
            {
                this.machineService.send('minimize');
            });

            // Size toggle
            $(this.window + " #size-toggle").on('click', () =>
            {
                this.machineService.send('sizeToggle');
            });

            // Close
            $(this.window + " #window-close").on('click', () =>
            {
                this.machineService.send('close');
            });
        });
    }

    makeMaximized()
    {
        $(this.window).css("transition", String(this.transitionTime) + "s");
        setTimeout( () => { $(this.window).css("transition", "0s"); }, (this.transitionTime * 100) );

        // Store the size and position vars, will activate these if window is shrunk
        this.lastPosition = $(this.window).position();
        this.lastWidth = $(this.window).css("width");
        this.lastHeight = $(this.window).css("height");

        // Make the window fullscreen
        // Make window go to left and top of containement
        $(this.window).css('left', $(this.containment).position().left);
        $(this.window).css('top',  $(this.containment).position().top);
        // Make window grow to size of containment
        $(this.window).css('width', $(this.containment).width());
        $(this.window).css('height', $(this.containment).height());

        // Remove border
        $(this.window).css("border", "0");
        $(this.window).css("border-radius", "0");
        $(this.window + " .window-bar").css("border-radius", "0");
    }

    makeWindowed()
    {
        // Up the transition speed, and reset it back to zero for smooth dragging
        $(this.window).css('transition', String(this.transitionTime) + 's');
        setTimeout( () => { $(this.window).css('transition', '0s'); }, (this.transitionTime * 100) );

        // Make the window windowed and set to last pos and size
        $(this.window).css('left', this.lastPosition.left);
        $(this.window).css('top', this.lastPosition.top);
        $(this.window).css('width', this.lastWidth);
        $(this.window).css('height', this.lastHeight);

        // Add the border back
        $(this.window).css("border", "1px solid rgb(41, 32, 35)");
        $(this.window + " .window-bar").css("border-radius", "5px");
        $(this.window).css("border-radius", "5px");
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


    /*
    Draw Window
    ------------
    */

    drawWindow()
    {
        var _html = `
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
                        <span id='window-minimize'><i class='fas fa-minus fa-xs'></i></span>
                        <span id='size-toggle'><i class='far fa-square fa-xs'></i></span>
                        <span id='window-close'><i class='fas fa-times-circle' style='color: rgb(223, 74, 22);'></i></span>
                    </div>
                </div>

            </div>

            <!-- Window Content -->
            <div class='window-content'>
                ` + this.windowContent + `
            </div>
        `;

        return _html;
    }

    
    /*
    Responsive Features
    --------------------
    */

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
        $('.window').css("z-index", "1");
        $(this.window).css("z-index", "2");
    }

    // Get center of containment
    centerWindow()
    {
        // Find the center of this new container
        var offset = $(this.containment).offset();
        var containerWidth = $(this.containment).width();
        var containerHeight = $(this.containment).height();

        var centerX = (offset.left + containerWidth / 2) - $(this.window).width() / 2;
        var centerY = (offset.top + containerHeight / 2) - $(this.window).height() / 2;

        $(this.window).css("left", centerX);
        $(this.window).css("top", centerY);
    }

    


}


/*
Window Class
--------
*/

// This class exists to build off of.
class Window extends WindowSetup
{
    constructor(_windowId)
    {
        super(_windowId);

        $( () =>
        {
            // Make windows draggable. MUST BE LAST
            this.dragAndResize();
        });
    }
}
