-- Uruchamiane tylko przy pierwszej inicjalizacji wolumenu Postgresa.
-- Tworzy osobną bazę na potrzeby testów integracyjnych (tests/unit),
-- odizolowaną od bazy deweloperskiej "users_app".
CREATE DATABASE users_app_test;
