class Cmd
{

    constructor()
    {
        this.cursor = "";

        this.activateTerminal();

        $( () =>
        {
            this.focusOnClick();
            this.inputListener();
        });
    }

    
    /*
    Focus on CMD
    ---------------
    This code focuses on the input no matter what
    */

    activateTerminal()
    {
        // Focus on the input
        $('input').focus();

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
            $('input').focus();
        });
    }

    // Refocus on terminal when clicking on the window
    focusOnClick()
    {

        $("#terminal").on("click", () =>
        {
            this.activateTerminal();
        });
        
        /*
        $('input').on('focusout', () =>
        {
            this.activateTerminal();
        });
        */

        
    }


    /*
    Input updating
    ----------------
    Add the typed text to the element storing it
    */

    inputListener()
    {

        // Changes the input on user input
        $('input').on('input', () =>
        {
            $('#cmd span').text($('input').val());
        });
        
        $('input').blur( () =>
        {
            clearInterval(this.cursor);
            $('#cursor').css({
            visibility: 'visible'
            });
        });

    }
    

}

var cmd = new Cmd();