package com.savannahostrowski.rhododendron;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;


import java.sql.*;
import java.util.*;

import org.json.*;
import spark.Spark;

import static spark.Spark.*;

public class App {
    private static Connection connection = null;

    public static void main(String[] args) {
        Spark.staticFileLocation("/frontend");

        try {
            connection = DriverManager.getConnection("jdbc:sqlite:/root/rhododendron/rhododendron.db");
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(30);

            DatabaseMetaData md = connection.getMetaData();
            ResultSet tables = md.getTables(null, null, "symptoms", null);
            if (!tables.next()) {
                statement.executeUpdate("CREATE TABLE symptoms (date CHAR(10)," +
                        "symptom CHAR(100), PRIMARY KEY (date, symptom))");
                System.out.println("DB created");
            }

            System.out.println("Connected to DB successfully");

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
            String oneMonthAgoDate = req.queryParams("start");
            String todayDate = req.queryParams("end");
            String historicalQuery = "SELECT * FROM symptoms WHERE date between ? AND ?";
            PreparedStatement sqlStatement = connection.prepareStatement(historicalQuery);
            sqlStatement.setString(1, oneMonthAgoDate);
            //get dates from javascript
            sqlStatement.setString(2, todayDate);
            ResultSet rs = sqlStatement.executeQuery();
            String x = sqlStatement.toString();
            return convertToJson(rs);
        });

        post("/api/add-symptoms", (req, res) -> {
            JSONObject body = new JSONObject(req.body());
            String symptoms = body.getString("symptoms").trim();
            String[] symptomsAsArray = symptoms.split(",");
            System.out.println(symptoms);
            String date = body.getString("date");

            dbInsert(symptomsAsArray, date);
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
        HashMap<String, ArrayList<String>> json = new HashMap<>();
        try {
            while(rs.next()) {
                String date = rs.getString("date");
                if (json.containsKey(date)) {
                    json.get(date).add(rs.getString("symptom"));
                } else {
                    ArrayList<String> symptoms = new ArrayList<>();
                    symptoms.add(rs.getString("symptom"));
                    json.put(date, symptoms);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Gson gson = new GsonBuilder().create();
        return gson.toJson(json);
    }


}


