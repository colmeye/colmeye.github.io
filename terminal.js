/*
Terminal Class
--------
*/

class Terminal extends Window
{
    
    constructor(_windowId)
    {
        super(_windowId);
        // Draw the terminal in the window!
        this.inputLine = "<span id='user'>user@machine</span><span>:<b style='color:rgb(51, 93, 158);'>~</b>$</span> ";
        this.setContent( this.createWindowContent() );
        
        // Terminal Vars
        this.cursor = "";
        this.input = "#terminalInput";
        this.contentArea = "#input-log";
        
        // Activate the terminal on load
        this.activateTerminal();

        // Run constantly
        $( () =>
        {
            // Activate terminal on click
            this.focusOnClick();

            // Listen for keyboard input
            this.inputHandler();

            // Make windows draggable. MUST BE LAST
            this.dragAndResize();
        });
    }

    
    /*
    Focus on Terminal
    ---------------
    This code focuses on the input no matter what
    */

    activateTerminal()
    {
        // Focus on the input
        $(this.input).focus();

        // Make the cursor blink
        this.cursor = window.setInterval( () =>
        {
            if ($('#cursor').css('visibility') === 'visible')
            {
                $('#cursor').css({
                    visibility: 'hidden'
                });
            }
            else 
            {
                $('#cursor').css({
                    visibility: 'visible'
                });
            }
        }, 500);

        // Refocus on the input after each keypress
        $('#cmd').keypress( () =>
        {
            $(this.input).focus();
        });
    }

    // Refocus on terminal when clicking on the window
    focusOnClick()
    {
        $( this.window ).on("click", () =>
        {
            this.activateTerminal();
        });
    }


    /*
    Input handling
    ----------------
    Listen for keyboard inputs. This includes typing and entering
    */

    inputHandler()
    {
        // Changes the input on user input
        $(this.input).on('input', () =>
        {
            $('#cmd span').text( $(this.input).val() );
        });
        
        $(this.input).blur( () =>
        {
            clearInterval(this.cursor);
            $('#cursor').css({
                visibility: 'visible'
            });
        });

        $(this.input).on('keypress', (_key) =>
        {
            if (_key.which == 13) // If enter pressed
            {
                var inputValue = $(this.input).val();

                this.printLine( this.inputLine + inputValue );
                this.runCommand( inputValue );
                this.clearInput();
            }
        });
    }

    
    /*
    Terminal Functions
    --------------------
    These functions have to do with submitting input to the terminal and processing it.
    */

    // Add line to the content area in terminal
    printLine(_stringVal)
    {
        // Append input to terminal
        $(this.contentArea).append( "<span>" + _stringVal + "</span><br>" );
        // Scroll to latest input
        $(this.contentArea).scrollTop( $(this.contentArea).prop("scrollHeight") );
    }

    printLines(_stringVal)
    {
        // Append input to terminal
        $(this.contentArea).append( "<pre>" + _stringVal + "</pre><br>" );
        // Scroll to latest input
        $(this.contentArea).scrollTop( $(this.contentArea).prop("scrollHeight") );
    }

    // Empty the input
    clearInput()
    {
        $(this.input).val("");
        $('#cmd span').text("");
    }

    // Run the commands
    runCommand(_inputVal)
    {
        // Divide input by spaces
        var _inputArray = _inputVal.split(" ");
        
        // Make following words into arguments
        var _inputArrayArgs = [];
        for (var i = 1; i < _inputArray.length; i++)
        {
            _inputArrayArgs.push( _inputArray[i] )
        }

        // Check if the first input word of _inputArray is a function inside our literal object :)
        if ( $.isFunction( commands[ _inputArray[0] ] ) )
        {
            // Run the first part of input, pass rest as args
            // Passing "this" as first arg allows the literal object to use "Terminal" class functions!
            commands[ _inputArray[0] ](this, _inputArrayArgs);
        }
        else
        {
            // Command was not found
            this.printLine('"' + _inputArray[0] + '" is not a command.');
        }
        
    }



    /*
    Terminal Content
    */

    createWindowContent()
    {
        var _html = `
            <div class='h-100 p-2'>
                <div id='input-log'>
                    <p>Welcome to my window demo</p>
                </div>

                <div id='input-area' class='d-flex align-items-end'>
                    <!-- INPUT AREA -->
                    ` + this.inputLine + `
                    <div id='cmd'>
                        <span id='written-text'></span>
                        <div id='cursor'></div>
                    </div>
                    
                    <input id="terminalInput" type='text' name='command' value='' autofocus>
                </div>
            </div>
        `

        return _html;
    }



}



/*
Command Literal Object
------------------------
This object stores all the commands that the terminal can run
*/

commands = {
    
    help: function(_this)
    {
        _this.printLine("Help Menu");
    },

    cd: function(_this, _args)
    {
        if ( checkArgs(_args, 1) )
        {
            _this.printLine("test");
        }
    },

    checkArgs: function(_args, _minAmount)
    {

        if (_args.length > _minAmount)
        {
            return true;
        }
        
    }

}
