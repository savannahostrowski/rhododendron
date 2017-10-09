$(document).ready(function() {
      $('.feeling-good').click(function() {
        $('.no-symptoms').show().fadeIn('slow');
        $('.initial').fadeOut('slow');
    });

    $('.feeling-bad').click(function() {
        // resets the form data
        $('.input-area').val('');
        $('.symptoms').show().fadeIn('slow');
        $('.initial').fadeOut('slow');
    });

    $('.symptom-history').click(function() {
        $('.trends').show().fadeIn('slow');
        $('.no-symptoms').fadeOut('slow');

    });

    $('.back-to-home').click(function() {
        $('.initial').show().fadeIn('slow');
        $('.trends').fadeOut('slow');
        // remove table div when exiting the visualization
        $('table').remove();

    });

    $('.input-button').click(function() {
        $('.common-symptom').remove();
        $('.trends').show().fadeIn('slow');
        $('.symptoms').fadeOut('slow');

    });

});