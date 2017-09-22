package com.savannahostrowski.rhododendron;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;


import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.json.*;
import spark.Spark;
import sun.java2d.pipe.SpanShapeRenderer;

import static spark.Spark.*;

public class App {
    private static Connection connection = null;

    public static void main(String[] args) {
        Spark.staticFileLocation("frontend");

        try {
            connection = DriverManager.getConnection("jdbc:sqlite:rhododendron.db");
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(30);
            System.out.println("Connected to DB successfully");

            statement.executeUpdate("DROP TABLE IF EXISTS symptoms");
            statement.executeUpdate("CREATE TABLE symptoms (date CHAR(10), symptom CHAR(100))");
            System.out.println("DB created");
            System.out.println("DB populated");

        } catch (SQLException e) {
            // if the error message is "out of memory",
            // it probably means no database file is found
            System.err.println(e.getMessage());
        }

        Spark.exception(Exception.class, (exception, request, response) -> {
            exception.printStackTrace();
        });

        //create endpoints for api
        get("/api/get-historical-symptoms", (req, res) -> {
            res.type("application/json");
            String oneMonthAgoDate = req.params().get("start");
            String todayDate = req.params().get("end");
            String historicalQuery = "SELECT * FROM symptoms WHERE date between ? AND ?";
            PreparedStatement sqlStatement = connection.prepareStatement(historicalQuery);
            sqlStatement.setString(1, todayDate);
            //get dates from javascript
            sqlStatement.setString(2, oneMonthAgoDate);
            ResultSet rs = sqlStatement.executeQuery();

            return convertToJson(rs);
        });

        post("/api/add-symptoms", (req, res) -> {
            JSONObject body = new JSONObject(req.body());
            String symptoms = body.getString("symptoms").trim();
            String[] symptomsAsArray = symptoms.split(",");
            System.out.println(symptoms);
            String date = body.getString("date");

            dbInsert(symptomsAsArray, date);
//            // Return success or error method
            return true;
        });
    }

    private static void dbInsert(String[] symptoms, String date) throws IOException, SQLException {
        String sqlStatement = "INSERT OR IGNORE INTO symptoms VALUES(?, ?)";
        PreparedStatement statement = connection.prepareStatement(sqlStatement);
        for (String symptom: symptoms) {
            statement.setString(1, date);
            statement.setString(2, symptom);
            statement.executeUpdate();
        }

    }

    private static String convertToJson(ResultSet rs) {
        ArrayList<String> output = new ArrayList<>();
        try {
            while(rs.next()) {
                output.add(rs.toString());
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Gson gson = new GsonBuilder().create();
        return gson.toJson(output);
    }


}


