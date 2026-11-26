cmake_minimum_required(VERSION 3.15)

project(CadenceWasm LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(HUM "$ENV{HOME}/projects/humlib")

file(GLOB HUM_SOURCES CONFIGURE_DEPENDS
    "${HUM}/src/*.cpp"
    "${HUM}/src/pugixml/*.cpp"
    "${HUM}/src/midifile/*.cpp"
)

add_library(humlib STATIC ${HUM_SOURCES})

target_include_directories(humlib PUBLIC
    "${HUM}/include"
    "${HUM}/include/pugixml"
    "${HUM}/include/midifile"
)

add_executable(cadence
    cadence-analysis-v3.cpp
)

target_link_libraries(cadence PRIVATE humlib)

set_target_properties(cadence PROPERTIES
    SUFFIX ".js"
)

target_link_options(cadence PRIVATE
    "-sMODULARIZE=1"
    "-sEXPORT_NAME=createCadenceModule"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sFORCE_FILESYSTEM=1"
    "-sINVOKE_RUN=0"
    "-sEXPORTED_RUNTIME_METHODS=['FS','callMain']"
    "-sENVIRONMENT=web,node"
)
