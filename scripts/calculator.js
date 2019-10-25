$(document).ready(function(){
    $(document).on('submit', '#consumption_form', function() {
        var monthly_consumption = $("#monthly_consumption").val();
        var monthly_bill        = $("#monthly_bill").val();
        var user_price = monthly_bill/monthly_consumption;
        var avg_price = 0.55;               // PLN/kWh
        var constant_yearly_charge = 160;   //PLN
        var yearly_needed_energy = 0;
        var yearly_consumption = 0;
        var cost = 0;
        var donation = 0;
        var single_module_power = 0.27;      //kW
        var single_module_surface = 1.7;    //m2
        var modules = 0;
        var surface = 0;
        
        if ($.isNumeric(monthly_consumption) && monthly_consumption > 0 && monthly_consumption < 3130){
    	    yearly_consumption = 12 * monthly_consumption;
    	    $("#yearly_consumption").text(yearly_consumption + ' kWh');
        }
            
        if (yearly_consumption*1.2 < 10000)
            yearly_needed_energy = yearly_consumption*1.16;
        else
            yearly_needed_energy = yearly_consumption*1.21;
        
        indicated_installation_power = yearly_needed_energy/1000;
        modules = Math.ceil(indicated_installation_power / single_module_power);
        surface = modules * single_module_surface;
        
        if (indicated_installation_power <= 3.8)   // koszt instalacji zależy od jej mocy, przy obliczaniu kosztów sugerowałem się obliczeniami serwisu https://globenergia.pl/
            cost = 23000;
        else if (indicated_installation_power > 3.3 && indicated_installation_power <= 4.8)
            cost = 24300;
        else if (indicated_installation_power > 4.8 && indicated_installation_power <= 6)
            cost = 28300;
        else if (indicated_installation_power > 6 && indicated_installation_power <= 10)
            cost = 32600;
        else if (indicated_installation_power > 10)
            cost = parseInt(indicated_installation_power * 4000);
        
        if (indicated_installation_power > 2 && indicated_installation_power < 10){
            $("#donation_info_div").show();
            $("#donation_div").show();
            donation = 5000;
            $("#cost").text(cost + " zł");
            $("#donation").text("- " + donation + " zł");
            cost = cost - donation;
            $("#cost_with_donation").text(cost + " zł");
        }else{
            $("#donation_info_div").hide();
            $("#donation_div").hide();
            $("#cost_with_donation").text(cost + " zł");
        }
        
        
        if (parseFloat(user_price) && user_price > 0){
            user_price = parseFloat(user_price);
            standard_yearly_energy_cost = yearly_consumption * user_price;
        }else{
            standard_yearly_energy_cost = yearly_consumption * avg_price;
        }
        standard_yearly_energy_cost += constant_yearly_charge;
        
        $("#indicated_installation_power").text(indicated_installation_power.toFixed(2) + " kWp");
        
        return_time = parseInt(Math.ceil(cost/standard_yearly_energy_cost));
        $("#return_time").text(return_time + " latach");
        
        $("#savings").text(parseInt(standard_yearly_energy_cost) + " zł");
        $("#surface").text(surface.toFixed(2) + " m²");
        $("#results").show();
        return false;
    });
});