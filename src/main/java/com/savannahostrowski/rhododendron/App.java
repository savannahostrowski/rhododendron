package com.savannahostrowski.rhododendron;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;


import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static spark.Spark.*;

public class App {
    private static Connection connection = null;

    public static void main(String[] args) {

        try {
            connection = DriverManager.getConnection("jdbc:sqlite:/home/savannah/Documents/code/limon/movies.db");
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(30);
            System.out.println("Connected to DB successfully");

            statement.executeUpdate("DROP TABLE IF EXISTS symptoms");
            statement.executeUpdate("CREATE TABLE symptoms (date INT, symptom CHAR(100)");
            System.out.println("DB created");
            System.out.println("DB populated");

        } catch (SQLException e) {
            // if the error message is "out of memory",
            // it probably means no database file is found
            System.err.println(e.getMessage());
        }

        //create endpoints for api
        get("/api/historical-symptoms.json", (req, res) -> {
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(30);
            String orderSQLStatement = "SELECT * FROM symptoms WHERE date BETWEEN 'now' AND 'start of month'";
            ResultSet rs = statement.executeQuery(orderSQLStatement);
            return true;
        });

//        post("/api/add-symptoms", (req, res) -> {
//
//            return dbInsert(symptoms);
//        });
    }

    private static void dbInsert(List<String> symptomsJson, String date) throws IOException, SQLException {
        String sqlStatement = "INSERT OR IGNORE INTO movies VALUES(?, ?)";
        PreparedStatement statement = connection.prepareStatement(sqlStatement);
        for (String symptomJson: symptomsJson) {
            statement.setString(1, symptomJson);
            statement.setString(2, date);
            statement.executeUpdate();
        }

    }

}
